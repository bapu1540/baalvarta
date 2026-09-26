/**
 * Baalvarta Theme, Font and Text Size Manager
 */

export type ThemeColor = 'amber' | 'sky' | 'emerald' | 'purple' | 'rose' | 'night';
export type AppFont = 'baloo' | 'rozha' | 'mukta' | 'quicksand';
export type AppFontSize = 'normal' | 'large' | 'huge';

export interface ThemeSettings {
  color: ThemeColor;
  font: AppFont;
  fontSize: AppFontSize;
}

const STORAGE_KEY = 'baalvarta_theme_settings_v1';

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  color: 'amber',
  font: 'baloo',
  fontSize: 'normal',
};

export function getStoredThemeSettings(): ThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      color: ['amber', 'sky', 'emerald', 'purple', 'rose', 'night'].includes(parsed.color) ? parsed.color : 'amber',
      font: ['baloo', 'rozha', 'mukta', 'quicksand'].includes(parsed.font) ? parsed.font : 'baloo',
      fontSize: ['normal', 'large', 'huge'].includes(parsed.fontSize) ? parsed.fontSize : 'normal',
    };
  } catch {
    return DEFAULT_THEME_SETTINGS;
  }
}

export function saveStoredThemeSettings(settings: ThemeSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyThemeToDOM(settings);
  } catch {
    // ignore
  }
}

export function applyThemeToDOM(settings: ThemeSettings) {
  const root = document.documentElement;
  const body = document.body;

  // 1. Remove previous theme classes
  body.classList.remove('theme-amber', 'theme-sky', 'theme-emerald', 'theme-purple', 'theme-rose', 'theme-night');
  body.classList.add(`theme-${settings.color}`);

  // Night mode background & text
  if (settings.color === 'night') {
    root.classList.add('dark');
    body.classList.add('bg-slate-950', 'text-slate-100');
    body.classList.remove('bg-amber-50/40', 'text-slate-800');
  } else {
    root.classList.remove('dark');
    body.classList.remove('bg-slate-950', 'text-slate-100');
    if (settings.color === 'sky') {
      body.classList.add('bg-sky-50/40');
      body.classList.remove('bg-amber-50/40', 'bg-emerald-50/40', 'bg-purple-50/40', 'bg-rose-50/40');
    } else if (settings.color === 'emerald') {
      body.classList.add('bg-emerald-50/40');
      body.classList.remove('bg-amber-50/40', 'bg-sky-50/40', 'bg-purple-50/40', 'bg-rose-50/40');
    } else if (settings.color === 'purple') {
      body.classList.add('bg-purple-50/40');
      body.classList.remove('bg-amber-50/40', 'bg-sky-50/40', 'bg-emerald-50/40', 'bg-rose-50/40');
    } else if (settings.color === 'rose') {
      body.classList.add('bg-rose-50/40');
      body.classList.remove('bg-amber-50/40', 'bg-sky-50/40', 'bg-emerald-50/40', 'bg-purple-50/40');
    } else {
      body.classList.add('bg-amber-50/40');
      body.classList.remove('bg-sky-50/40', 'bg-emerald-50/40', 'bg-purple-50/40', 'bg-rose-50/40');
    }
  }

  // 2. Font family
  body.classList.remove('font-baloo', 'font-rozha', 'font-mukta', 'font-quicksand');
  body.classList.add(`font-${settings.font}`);

  // 3. Font Size Scaling
  root.style.fontSize = settings.fontSize === 'huge' ? '18px' : settings.fontSize === 'large' ? '17px' : '16px';
}
