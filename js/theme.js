// ===================================================================
// WalletWise - js/theme.js
// DARK MODE
// Applies and saves the light/dark theme, driven by the switch in
// the sidebar footer.
// ===================================================================

// Applies a theme ('light' or 'dark') to the whole document by
// setting a data-theme attribute on <html>, which the CSS variables
// in css/variables.css respond to.
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleInput.checked = theme === 'dark';
}

themeToggleInput.addEventListener('change', function () {
  const newTheme = themeToggleInput.checked ? 'dark' : 'light';
  applyTheme(newTheme);
  saveThemeToStorage(newTheme);
});
