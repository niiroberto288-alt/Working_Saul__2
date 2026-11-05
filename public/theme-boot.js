// Reads the stored theme before first paint so the page never flashes light
// then dark. Loaded synchronously from <head>; kept tiny on purpose.
// localStorage is used for the theme preference only (FURPS+ R5).
;(function () {
  try {
    var stored = window.localStorage.getItem('attachtrack.theme')
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
    }
  } catch (error) {
    /* Storage can be unavailable (private mode); light theme stays default. */
  }
})()
