import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLOR_OPTIONS, DEFAULT_CATEGORIES, ICON_OPTIONS } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/locales/i18n';
import { useStore } from '@/store/useStore';
import { CustomCategory } from '@/types';

const DEFAULT_KEYS = new Set(DEFAULT_CATEGORIES.map((c) => c.key));

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ManageCategoriesScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const customCategories = useStore((s) => s.customCategories);
  const addCustomCategory = useStore((s) => s.addCustomCategory);
  const deleteCustomCategory = useStore((s) => s.deleteCustomCategory);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const key = slugify(trimmed);
    if (!key) return;

    if (DEFAULT_KEYS.has(key) || customCategories.some((c) => c.key === key)) {
      Alert.alert(t('manageCategories.duplicateKey'));
      return;
    }

    const newCategory: CustomCategory = {
      key,
      label: trimmed,
      icon: selectedIcon,
      color: selectedColor,
    };

    addCustomCategory(newCategory);
    setIsAdding(false);
    setName('');
    setSelectedIcon(ICON_OPTIONS[0]);
    setSelectedColor(COLOR_OPTIONS[0]);
  };

  const handleDelete = (key: string) => {
    Alert.alert(t('manageCategories.deleteTitle'), t('manageCategories.deleteMessage'), [
      { text: t('manageCategories.cancel'), style: 'cancel' },
      {
        text: t('manageCategories.delete'),
        style: 'destructive',
        onPress: () => deleteCustomCategory(key),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {t('manageCategories.title')}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <FlatList
        data={customCategories}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          isAdding ? (
            <View style={[styles.addForm, { backgroundColor: theme.backgroundElement }]}>
              <TextInput
                style={[styles.nameInput, { color: theme.text, borderColor: theme.textSecondary + '40' }]}
                placeholder={t('manageCategories.name')}
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                autoFocus
              />

              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                {t('manageCategories.icon')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
                {ICON_OPTIONS.map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: selectedIcon === icon ? selectedColor + '20' : 'transparent',
                        borderColor: selectedIcon === icon ? selectedColor : theme.textSecondary + '30',
                      },
                    ]}>
                    <Ionicons
                      name={icon as keyof typeof Ionicons.glyphMap}
                      size={22}
                      color={selectedIcon === icon ? selectedColor : theme.textSecondary}
                    />
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
                {t('manageCategories.color')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
                {COLOR_OPTIONS.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: color,
                        borderWidth: selectedColor === color ? 3 : 0,
                        borderColor: theme.text,
                      },
                    ]}
                  />
                ))}
              </ScrollView>

              <View style={styles.formActions}>
                <Pressable
                  onPress={() => setIsAdding(false)}
                  style={[styles.formButton, { backgroundColor: theme.backgroundSelected }]}>
                  <Text style={[styles.formButtonText, { color: theme.text }]}>
                    {t('manageCategories.cancel')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  style={[styles.formButton, { backgroundColor: selectedColor }]}>
                  <Text style={[styles.formButtonText, { color: '#fff' }]}>
                    {t('manageCategories.save')}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.categoryRow, { backgroundColor: theme.backgroundElement }]}>
            <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={item.color}
              />
            </View>
            <Text style={[styles.categoryLabel, { color: theme.text }]}>{item.label}</Text>
            <Pressable onPress={() => handleDelete(item.key)}>
              <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          !isAdding ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('manageCategories.addNew')}
            </Text>
          ) : null
        }
        ListFooterComponent={
          !isAdding ? (
            <Pressable
              onPress={() => setIsAdding(true)}
              style={[styles.addButton, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
              <Text style={[styles.addButtonText, { color: '#007AFF' }]}>
                {t('manageCategories.addNew')}
              </Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addForm: {
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  nameInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: 'row',
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
  },
  formButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: Spacing.four,
  },
});
