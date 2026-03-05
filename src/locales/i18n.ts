import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

import { useStore } from '@/store/useStore';
import en from './en';
import sr from './sr';

const i18n = new I18n({ en, sr });
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

function getDeviceLanguage(): string {
  const locales = getLocales();
  const code = locales[0]?.languageCode ?? 'en';
  return code === 'sr' ? 'sr' : 'en';
}

function resolveLocale(language: string | undefined): string {
  if (!language || language === 'auto') return getDeviceLanguage();
  return language;
}

export function useTranslation() {
  const language = useStore((s) => s.settings.language);
  i18n.locale = resolveLocale(language);
  return { t: i18n.t.bind(i18n), locale: i18n.locale };
}

export function getDateLocale(language: string | undefined): string {
  const locale = resolveLocale(language);
  return locale === 'sr' ? 'sr-Latn' : 'en-US';
}
