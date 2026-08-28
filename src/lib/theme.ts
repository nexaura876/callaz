export type Theme = "light" | "dark" | "system";

export const THEME_KEY = "callaz-theme";
export const THEME_EVENT = "callaz:theme-change";

/** Present on <html> only while a theme swap is in flight. See suppressTransitions. */
export const SWITCHING_ATTR = "data-theme-switching";

/**
 * Runs before the first paint, inlined into the document head.
 *
 * It has to be a string rather than an imported function: React would only attach
 * the handler after hydration, and by then the page has already been painted in
 * the wrong theme. That flash is the entire problem this solves.
 *
 * Kept deliberately small and wrapped in try/catch, because localStorage throws in
 * Safari private mode and a theme preference is not worth a blank page.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  suppressTransitions(root);

  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }

  try {
    if (theme === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  } catch {
    // A preference we cannot persist is still worth applying for this page view.
  }

  window.dispatchEvent(new Event(THEME_EVENT));
}

/**
 * Turns every transition off for the frame in which the theme swaps.
 *
 * Most surfaces carry a 300ms transition on background-color, border-color and
 * colour, for hover. Without this, flipping the theme animates all of them at
 * once and the whole page cross-fades — every card, rule and label sliding
 * between palettes together. It reads as a rendering fault rather than a choice.
 * An instant swap is what the control implies and what other sites do.
 *
 * Hover transitions are restored immediately afterwards.
 */
function suppressTransitions(root: HTMLElement) {
  root.setAttribute(SWITCHING_ATTR, "");

  const restore = () => root.removeAttribute(SWITCHING_ATTR);

  // Two frames is the right moment: one for the attribute to apply, one for the
  // repaint. But rAF does not run in a background tab, and leaving the attribute
  // set would disable every transition on the page for the rest of the visit, so
  // a timer backs it up. Whichever lands first wins; the second is a no-op.
  requestAnimationFrame(() => requestAnimationFrame(restore));
  setTimeout(restore, 120);
}

/**
 * The same cross-fade happens without any click when the visitor changes their OS
 * theme with a page open, so the media query gets the same treatment. Called once
 * from the toggle, which is mounted on every page.
 */
export function watchSystemTheme() {
  const media = window.matchMedia("(prefers-color-scheme: light)");

  const onChange = () => {
    if (readTheme() !== "system") return; // an explicit choice wins
    suppressTransitions(document.documentElement);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** What the page is actually showing right now, with "system" resolved. */
export function resolvedTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}
