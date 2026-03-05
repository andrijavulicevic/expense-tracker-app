import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { CURRENCIES } from '@/constants/currencies';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/locales/i18n';
import { useStore } from '@/store/useStore';

export default function OnboardingScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const updateSettings = useStore((s) => s.updateSettings);
  const [selected, setSelected] = useState('RSD');

  const handleStart = () => {
    updateSettings({ currency: selected, hasOnboarded: true });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Ionicons name="wallet-outline" size={64} color="#007AFF" />
        <Text style={[styles.title, { color: theme.text }]}>{t('onboarding.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('onboarding.subtitle')}
        </Text>

        <View style={styles.currencies}>
          {CURRENCIES.map((c) => (
            <Pressable
              key={c.code}
              onPress={() => setSelected(c.code)}
              style={[
                styles.currencyOption,
                {
                  backgroundColor:
                    selected === c.code ? '#007AFF' : theme.backgroundElement,
                  borderColor:
                    selected === c.code ? '#007AFF' : theme.backgroundSelected,
                },
              ]}>
              <Text
                style={[
                  styles.currencySymbol,
                  { color: selected === c.code ? '#FFFFFF' : theme.text },
                ]}>
                {c.symbol}
              </Text>
              <Text
                style={[
                  styles.currencyLabel,
                  { color: selected === c.code ? '#FFFFFF' : theme.textSecondary },
                ]}>
                {c.code}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Button title={t('onboarding.start')} onPress={handleStart} style={styles.button} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  icon: {
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  currencies: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.four,
  },
  currencyOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 16,
    borderWidth: 1,
    gap: Spacing.one,
    minWidth: 90,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    width: '100%',
  },
});
