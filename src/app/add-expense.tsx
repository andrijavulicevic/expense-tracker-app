import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/CategoryPicker';
import { NumberPad } from '@/components/NumberPad';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/useStore';
import { CategoryKey } from '@/types';
import { toDateString, todayString, yesterdayString } from '@/utils/dateHelpers';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AddExpenseScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!params.id;

  const currency = useStore((s) => s.settings.currency);
  const existingExpense = useStore((s) => s.expenses.find((e) => e.id === params.id));
  const addExpense = useStore((s) => s.addExpense);
  const updateExpense = useStore((s) => s.updateExpense);
  const deleteExpense = useStore((s) => s.deleteExpense);

  const [amountStr, setAmountStr] = useState(
    existingExpense ? String(existingExpense.amount) : ''
  );
  const [category, setCategory] = useState<CategoryKey | null>(
    existingExpense?.category ?? null
  );
  const [title, setTitle] = useState(existingExpense?.title ?? '');
  const [note, setNote] = useState(existingExpense?.note ?? '');
  const [date, setDate] = useState(existingExpense?.date ?? todayString());
  const [showPicker, setShowPicker] = useState(false);

  const isCustomDate = date !== todayString() && date !== yesterdayString();

  const amount = parseFloat(amountStr) || 0;
  const canSave = amount > 0 && category !== null;

  const handleInput = useCallback(
    (key: string) => {
      setAmountStr((prev) => {
        if (key === '.' && prev.includes('.')) return prev;
        const parts = prev.split('.');
        if (parts[1] && parts[1].length >= 2) return prev;
        if (prev === '0' && key !== '.') return key;
        return prev + key;
      });
    },
    []
  );

  const handleDelete = useCallback(() => {
    setAmountStr((prev) => prev.slice(0, -1));
  }, []);

  const handleDatePick = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(toDateString(selectedDate));
    }
  };

  const handleSave = () => {
    if (!canSave || category === null) return;

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (isEditing && params.id) {
      updateExpense(params.id, {
        amount,
        category,
        title: title.trim() || undefined,
        note: note.trim() || undefined,
        date,
      });
    } else {
      addExpense({
        amount,
        category,
        title: title.trim() || undefined,
        note: note.trim() || undefined,
        date,
      });
    }
    router.back();
  };

  const handleDeleteExpense = () => {
    if (!params.id) return;
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteExpense(params.id!);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.cancelText, { color: '#007AFF' }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {isEditing ? 'Edit Expense' : 'Add Expense'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amountDisplay, { color: theme.text }]}>
          {amountStr ? formatCurrency(amount, currency) : formatCurrency(0, currency)}
        </Text>
      </View>

      <View style={styles.body}>
        <NumberPad onInput={handleInput} onDelete={handleDelete} />

        <CategoryPicker selected={category} onSelect={setCategory} />

        <TextInput
          placeholder="Title (e.g. Groceries)"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.titleInput,
            {
              color: theme.text,
              backgroundColor: theme.backgroundElement,
            },
          ]}
        />

        <TextInput
          placeholder="Add a note..."
          placeholderTextColor={theme.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={[
            styles.noteInput,
            {
              color: theme.text,
              backgroundColor: theme.backgroundElement,
            },
          ]}
        />

        <View style={styles.dateRow}>
          <Pressable
            onPress={() => setDate(yesterdayString())}
            style={[
              styles.dateChip,
              {
                backgroundColor:
                  date === yesterdayString() ? '#007AFF' : theme.backgroundElement,
              },
            ]}>
            <Text
              style={[
                styles.dateChipText,
                { color: date === yesterdayString() ? '#FFFFFF' : theme.text },
              ]}>
              Yesterday
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setDate(todayString())}
            style={[
              styles.dateChip,
              {
                backgroundColor:
                  date === todayString() ? '#007AFF' : theme.backgroundElement,
              },
            ]}>
            <Text
              style={[
                styles.dateChipText,
                { color: date === todayString() ? '#FFFFFF' : theme.text },
              ]}>
              Today
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[
              styles.dateChip,
              {
                backgroundColor: isCustomDate ? '#007AFF' : theme.backgroundElement,
              },
            ]}>
            <View style={styles.dateChipContent}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={isCustomDate ? '#FFFFFF' : theme.text}
              />
              {isCustomDate && (
                <Text
                  style={[
                    styles.dateChipText,
                    { color: '#FFFFFF' },
                  ]}>
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              )}
            </View>
          </Pressable>
          {isCustomDate && (
            <Pressable
              onPress={() => setDate(todayString())}
              style={[styles.clearButton]}>
              <Ionicons name="close" size={14} color="#FF3B30" />
            </Pressable>
          )}
        </View>

        {showPicker && (
          <DateTimePicker
            value={new Date(date + 'T00:00:00')}
            mode="date"

            maximumDate={new Date()}
            onChange={handleDatePick}
          />
        )}

        <View style={styles.spacer} />

        <Button
          title={isEditing ? 'Update' : 'Save'}
          onPress={handleSave}
          disabled={!canSave}
        />

        {isEditing && (
          <Button title="Delete Expense" onPress={handleDeleteExpense} variant="destructive" />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 60,
  },
  amountContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
  },
  amountDisplay: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  titleInput: {
    fontSize: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: 12,
  },
  noteInput: {
    fontSize: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 72,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dateChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dateChipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dateChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,59,48,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
  },
});
