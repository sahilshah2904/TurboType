import { createClient, type Session } from "@supabase/supabase-js";
import { newGuestSave, parseGuestSave } from "../core/progression";
import { GUEST_KEY, LocalGuestRepository } from "./guest";

const PROJECT_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const PROJECT_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  string | undefined;
export const cloudAvailable =
  !!PROJECT_URL && !!PROJECT_KEY && globalThis.isSecureContext;
type RemoteSave = { revision: number; save: unknown } | null;
type Checkpoint = { remote: number; local: number };
type Account = {
  id: string;
  repository: LocalGuestRepository;
  checkpoint: Checkpoint;
  remote?: RemoteSave;
};

export function connectCloud(
  guest: LocalGuestRepository,
  switchRepository: (repo: LocalGuestRepository, signedIn: boolean) => void,
  showStatus: (text: string, signedIn: boolean, conflict: boolean) => void,
) {
  const client = createClient(PROJECT_URL!, PROJECT_KEY!, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
      persistSession: true,
      storage: sessionStorage,
      storageKey: "turbotype-auth",
    },
  });
  let active: Account | undefined;
  let timer: number | undefined;
  let busy: Account | undefined;
  let closed = false;
  let status = "Sign in to save progress across devices.";
  const display = (message = status) => {
    status = message;
    showStatus(status, !!active, active?.remote !== undefined);
  };
  const metaKey = (id: string) => `${GUEST_KEY}:account:${id}:checkpoint`;
  const saveCheckpoint = (account: Account, checkpoint: Checkpoint) => {
    account.checkpoint = checkpoint;
    try {
      localStorage.setItem(metaKey(account.id), JSON.stringify(checkpoint));
    } catch {
      /* Sync is still usable for this visit. */
    }
  };
  const checkpointFor = (id: string): Checkpoint => {
    try {
      const v = JSON.parse(
        localStorage.getItem(metaKey(id)) ?? "{}",
      ) as Partial<Checkpoint>;
      if (
        Number.isSafeInteger(v.remote) &&
        Number.isSafeInteger(v.local) &&
        v.remote! >= 0 &&
        v.local! >= 0
      )
        return { remote: v.remote!, local: v.local! };
    } catch {
      /* An unreadable checkpoint requires an explicit conflict choice. */
    }
    return { remote: 0, local: 0 };
  };
  const getRemote = async (id: string) =>
    client
      .from("turbotype_saves")
      .select("revision, save")
      .eq("owner", id)
      .maybeSingle<NonNullable<RemoteSave>>();

  function schedule() {
    window.clearTimeout(timer);
    if (!active || active.remote !== undefined) return;
    if (active.repository.snapshot().revision === active.checkpoint.local)
      return;
    display("Pending · Changes saved locally. Waiting for cloud sync.");
    timer = window.setTimeout(() => void sync(), 2500);
  }

  async function sync() {
    const account = active;
    if (!account || busy || account.remote !== undefined || closed) return;
    const save = account.repository.snapshot();
    if (save.revision === account.checkpoint.local) return;
    busy = account;
    try {
      const { data, error } = await client.rpc("turbotype_write_save", {
        account_id: account.id,
        expected: account.checkpoint.remote,
        candidate: save,
      });
      if (active !== account || closed) return;
      if (error?.code === "40001") {
        const remote = await getRemote(account.id);
        if (active !== account || closed) return;
        if (remote.error) display("Sync failed · Local copy kept. Try again.");
        else {
          account.remote = remote.data;
          display("Conflict · Choose the local or cloud copy.");
        }
      } else if (error?.code === "54000") {
        schedule();
      } else if (error || !Number.isSafeInteger(data)) {
        display(
          error?.code === "42501"
            ? "Cloud access requires an approved Google account. Local copy kept."
            : "Sync failed · Local copy kept. Try again.",
        );
      } else {
        saveCheckpoint(account, { remote: data, local: save.revision });
        display("Synced · Account progress is saved in the cloud.");
        schedule();
      }
    } catch {
      if (active === account)
        display("Sync failed · Local copy kept. Try again.");
    } finally {
      if (busy === account) busy = undefined;
      if (active && active !== account) schedule();
    }
  }

  async function restore(account: Account, remote: RemoteSave) {
    const raw = remote
      ? JSON.stringify(remote.save)
      : JSON.stringify(newGuestSave());
    if (!parseGuestSave(raw) || !account.repository.replace(raw, false)) {
      display(
        "The cloud copy could not be restored. Export your local copy before retrying.",
      );
      return;
    }
    account.remote = undefined;
    saveCheckpoint(account, {
      remote: remote?.revision ?? 0,
      local: account.repository.snapshot().revision,
    });
    switchRepository(account.repository, true);
    display("Synced · Cloud copy restored on this device.");
  }

  async function refresh(account: Account) {
    const approval = await client.rpc("turbotype_account_approved");
    if (active !== account || closed) return;
    if (!approval.error && approval.data !== true) {
      display(
        "Cloud access requires an approved Google account. This device’s copy stays local.",
      );
      return;
    }
    const { data: remote, error } = await getRemote(account.id);
    if (active !== account || closed) return;
    if (error) {
      display("Sync failed · Account cache kept on this device.");
      return;
    }
    const revision = remote?.revision ?? 0;
    const localRevision = account.repository.snapshot().revision;
    if (account.checkpoint.remote !== revision) {
      if (localRevision === account.checkpoint.local)
        await restore(account, remote);
      else {
        account.remote = remote;
        display("Conflict · Choose the local or cloud copy.");
      }
      return;
    }
    if (localRevision !== account.checkpoint.local) schedule();
    else
      display(
        remote
          ? "Synced · Account progress is saved in the cloud."
          : "Signed in · Start playing or import your guest progress.",
      );
  }

  function changeSession(session: Session | null) {
    if (closed || active?.id === session?.user.id) return;
    window.clearTimeout(timer);
    active?.repository.close();
    if (!session) {
      active = undefined;
      switchRepository(guest, false);
      display("Sign in to save progress across devices.");
      return;
    }
    const id = session.user.id;
    if (!/^[a-f0-9-]{36}$/i.test(id)) return;
    const prefix = `${GUEST_KEY}:account:${id}:`;
    const repository = new LocalGuestRepository(
      () => ({
        getItem: (key) => localStorage.getItem(prefix + key),
        setItem: (key, value) => localStorage.setItem(prefix + key, value),
      }),
      schedule,
      prefix,
    );
    active = { id, repository, checkpoint: checkpointFor(id) };
    switchRepository(repository, true);
    display("Checking your cloud save…");
    void refresh(active).catch(() =>
      display("Sync failed · Account cache kept on this device."),
    );
  }

  const subscription = client.auth.onAuthStateChange((_event, session) => {
    // Avoid invoking the SDK while its auth state lock is held.
    setTimeout(() => changeSession(session), 0);
  }).data.subscription;
  const redirect = new URL(location.href);
  const code = redirect.searchParams.get("code");
  if (code || redirect.searchParams.has("error")) {
    for (const key of ["code", "error", "error_code", "error_description"])
      redirect.searchParams.delete(key);
    history.replaceState(history.state, "", redirect);
    if (code)
      void client.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (closed) return;
        if (error) display("Google sign-in failed. Start again from Progress.");
        else location.hash = "#/progress";
      });
    else display("Google sign-in was canceled or failed.");
  }
  window.addEventListener("online", schedule);

  return {
    status: () => display(),
    signIn: async () => {
      const redirectTo = new URL(import.meta.env.BASE_URL, location.origin)
        .href;
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) display("Google sign-in could not start.");
    },
    signOut: async () => {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) display("Sign-out failed. Try again.");
    },
    retry: () => {
      if (active)
        void refresh(active).catch(() =>
          display("Sync failed · Local copy kept."),
        );
    },
    importGuest: () => {
      const account = active;
      if (!account || account.remote !== undefined) return;
      const count = Object.keys(guest.read().clears).length;
      if (
        window.confirm(
          `Import ${count} guest main clears and the guest records into this account? This replaces the account's current progress. The guest copy is kept.`,
        ) &&
        account.repository.replace(guest.exportCurrent())
      )
        switchRepository(account.repository, true);
    },
    useLocal: () => {
      const account = active;
      if (
        !account ||
        account.remote === undefined ||
        !window.confirm(
          "Replace the cloud save with this device’s account progress?",
        )
      )
        return;
      saveCheckpoint(account, {
        remote: account.remote?.revision ?? 0,
        local: -1,
      });
      account.remote = undefined;
      schedule();
    },
    useRemote: () => {
      const account = active;
      if (
        account?.remote !== undefined &&
        window.confirm("Replace the local account copy with the cloud save?")
      )
        void restore(account, account.remote);
    },
    removeSave: async () => {
      const account = active;
      if (
        !account ||
        busy ||
        !window.confirm(
          "Delete the cloud game save and reset the local account copy? Export a backup first if you want to keep it.",
        )
      )
        return;
      window.clearTimeout(timer);
      busy = account;
      try {
        const { error } = await client.rpc("turbotype_delete_save", {
          account_id: account.id,
        });
        if (account !== active || closed) return;
        if (error) {
          display("Cloud deletion failed. The local copy was kept.");
          return;
        }
        await restore(account, null);
        display(
          "Cloud game save deleted. Your Google sign-in remains available.",
        );
      } finally {
        busy = undefined;
      }
    },
    dispose: () => {
      closed = true;
      window.clearTimeout(timer);
      window.removeEventListener("online", schedule);
      subscription.unsubscribe();
      active?.repository.close();
    },
  };
}
