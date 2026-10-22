import "./styles.css";
import "./immersive.css";
import { mountApp } from "./ui/app";

const root = document.querySelector<HTMLElement>("#app")!;
let dispose: (() => void) | undefined;
try {
  dispose = mountApp(root);
} catch {
  root.innerHTML =
    '<main class="boot"><strong>Let’s try that again.</strong><p>TurboType could not start. Reload the page to retry.</p><button onclick="location.reload()">Reload TurboType</button></main>';
}
if (import.meta.hot) import.meta.hot.dispose(() => dispose?.());
