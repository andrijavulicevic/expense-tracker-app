import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/store/useStore';

export function useResolvedColorScheme(): 'light' | 'dark' {
  const systemScheme = useColorScheme();
  const themePreference = useStore((s) => s.settings.theme) ?? 'system';

  if (themePreference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return themePreference;
}

export function useTheme() {
  return Colors[useResolvedColorScheme()];
}
