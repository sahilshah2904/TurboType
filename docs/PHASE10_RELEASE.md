# Phase 10 single-player release

TurboType v0.1.0 uses rules version 3, content version 3 and guest save version 1. The release retains the Phase 9 save format. [Hosted game](https://sahilshah2904.github.io/TurboType/) · [Privacy policy](https://sahilshah2904.github.io/TurboType/privacy.html)

## Build and deploy

1. From a clean checkout use Node 24.13 and npm 11. Run `npm ci`, `npx playwright install chromium` and `npm run check`. The standard checks use a guest build. For an account-enabled build, set the two public variables in `.env.example` in your environment or ignored `.env.local`, run `npm run build` and then `node scripts/verify-pages-build.mjs`.
2. Keep GitHub Pages set to GitHub Actions and its `github-pages` environment restricted to `main`. Set the Supabase project URL and publishable key as repository variables. GitHub deploys the checked source from `main` and audits the compiled `dist/` folder before upload.
3. Keep the exact Pages address and development loopback address on the Supabase Auth redirect list. A return to the default localhost address means the Pages redirect still needs to be verified in the allowlist. Google Cloud uses the existing Supabase callback. Keep the Google OAuth secret in Supabase. The cloud audience is approved Google accounts. Broader Google consent publication and branding follow the owner's audience decision. [Redirect setup](https://supabase.com/docs/guides/auth/redirect-urls)
4. Verify the deployed version at the Pages URL before tagging. Complete a guest race, retry, check the level 2 unlock after reload, and open the public privacy page. Test Google restoration in the hosted origin with an approved account.

## Data and recovery

- Guest progress stays in the browser that ran the game. To move a localhost guest save to Pages, export it from Progress and import it on Pages while playing as a guest. Review the replacement prompt before applying.
- Account progress saves to the approved user's cloud record. While sync is pending, keep the tab open or export a backup. On a revision conflict, review the local and cloud copies before choosing. Sign-out clears the tab's account cache. Cloud save deletion removes the save. The sign-in identity is managed separately.
- Other Pages projects on the same hostname share the browser origin. Keep that origin limited to projects you trust. Use an isolated hostname if that changes.
- If a release must be rolled back, restore the known-good game source on `main` through a revert PR while retaining the Pages workflow. A successful main check redeploys it. Confirm the version and race/save behavior at the public URL. Preserve guest and cloud data. Any future save-schema change needs its own compatibility plan before rollback.

## Owner check

On the live link, sign in with an approved Google account and confirm the name, XP and saved level. Sign out and confirm the account badge and cloud data disappear. Sign in to the second account to confirm its separate save. Play one race using your physical keyboard and check Backspace, finish, retry and the next-level unlock at your normal browser zoom.
