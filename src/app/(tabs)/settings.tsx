import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CURRENCIES } from '@/constants/currencies';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/locales/i18n';
import { syncExpenses } from '@/services/syncService';
import { useStore } from '@/store/useStore';
import { ThemePreference } from '@/types';

const LANGUAGES = [
  { code: 'auto', label: (t: (k: string) => string) => t('settings.auto') },
  { code: 'en', label: () => 'English' },
  { code: 'sr', label: () => 'Srpski' },
] as const;

const THEMES: { code: ThemePreference; labelKey: string; icon: 'phone-portrait-outline' | 'sunny-outline' | 'moon-outline' }[] = [
  { code: 'system', labelKey: 'settings.themeSystem', icon: 'phone-portrait-outline' },
  { code: 'light', labelKey: 'settings.themeLight', icon: 'sunny-outline' },
  { code: 'dark', labelKey: 'settings.themeDark', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const currency = useStore((s) => s.settings.currency);
  const language = useStore((s) => s.settings.language);
  const themeSetting = useStore((s) => s.settings.theme);
  const syncUrl = useStore((s) => s.settings.syncUrl);
  const { lastSyncedAt, isSyncing, error: syncError } = useStore((s) => s.syncState);
  const updateSettings = useStore((s) => s.updateSettings);

  const handleSync = () => {
    syncExpenses();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView edges={['top']}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>{t('settings.title')}</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.language')}</Text>
        <View style={[styles.section, { backgroundColor: theme.backgroundElement }]}>
          {LANGUAGES.map((lang, index) => (
            <Pressable
              key={lang.code}
              onPress={() => updateSettings({ language: lang.code })}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: theme.backgroundSelected },
                index < LANGUAGES.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.backgroundSelected,
                },
              ]}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{lang.label(t)}</Text>
              {language === lang.code && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionSpacer} />

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.theme')}</Text>
        <View style={[styles.section, { backgroundColor: theme.backgroundElement }]}>
          {THEMES.map((themeOption, index) => (
            <Pressable
              key={themeOption.code}
              onPress={() => updateSettings({ theme: themeOption.code })}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: theme.backgroundSelected },
                index < THEMES.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.backgroundSelected,
                },
              ]}>
              <Ionicons name={themeOption.icon} size={20} color={theme.text} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{t(themeOption.labelKey)}</Text>
              {themeSetting === themeOption.code && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionSpacer} />

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.currency')}</Text>
        <View style={[styles.section, { backgroundColor: theme.backgroundElement }]}>
          {CURRENCIES.map((c, index) => (
            <Pressable
              key={c.code}
              onPress={() => updateSettings({ currency: c.code })}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: theme.backgroundSelected },
                index < CURRENCIES.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.backgroundSelected,
                },
              ]}>
              <Text style={[styles.rowSymbol, { color: theme.text }]}>{c.symbol}</Text>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{t(`currencies.${c.code}`)}</Text>
              {currency === c.code && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionSpacer} />

        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.sync')}</Text>
        <View style={[styles.section, { backgroundColor: theme.backgroundElement }]}>
          <View style={[styles.row, { borderBottomWidth: syncUrl ? StyleSheet.hairlineWidth : 0, borderBottomColor: theme.backgroundSelected }]}>
            <TextInput
              placeholder={t('settings.syncUrlPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              value={syncUrl}
              onChangeText={(text) => updateSettings({ syncUrl: text.trim() })}
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.syncInput, { color: theme.text }]}
            />
          </View>

          {syncUrl ? (
            <Pressable
              onPress={handleSync}
              disabled={isSyncing}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: theme.backgroundSelected },
              ]}>
              {isSyncing ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Ionicons name="sync" size={20} color="#007AFF" />
              )}
              <Text style={[styles.rowLabel, { color: '#007AFF' }]}>
                {isSyncing ? t('settings.syncing') : t('settings.syncNow')}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {lastSyncedAt ? (
          <Text style={[styles.syncStatus, { color: theme.textSecondary }]}>
            {t('settings.lastSynced', { time: new Date(lastSyncedAt).toLocaleString() })}
          </Text>
        ) : null}

        {syncError ? (
          <Text style={[styles.syncStatus, { color: '#FF3B30' }]}>
            {syncError}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '700',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.three,
  },
  sectionSpacer: {
    height: Spacing.three,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  rowSymbol: {
    fontSize: 17,
    fontWeight: '600',
    width: 40,
  },
  rowLabel: {
    fontSize: 16,
    flex: 1,
  },
  syncInput: {
    fontSize: 16,
    flex: 1,
  },
  syncStatus: {
    fontSize: 13,
    paddingHorizontal: Spacing.three,
  },
});
