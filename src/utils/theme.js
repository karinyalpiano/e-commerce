const THEME_KEY = 'app_theme_v1'

export function getTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  return saved === 'light' || saved === 'dark' ? saved : 'dark'
}

export function applyTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark'
  document.documentElement.dataset.theme = t
  localStorage.setItem(THEME_KEY, t)
}
