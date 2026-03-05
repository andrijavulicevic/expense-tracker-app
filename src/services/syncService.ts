import { useStore } from "@/store/useStore";

export async function syncExpenses(): Promise<void> {
  const {
    expenses,
    pendingDeleteIds,
    settings,
    syncState,
    setSyncState,
    replaceExpenses,
    clearPendingDeleteIds,
  } = useStore.getState();

  if (!settings.syncUrl || syncState.isSyncing) return;

  setSyncState({ isSyncing: true, error: null });

  try {
    // Only send expenses created or updated since last sync.
    // This prevents re-sending items that were deleted from the Sheet.
    const changedExpenses = syncState.lastSyncedAt
      ? expenses.filter(
          (e) =>
            e.createdAt > syncState.lastSyncedAt! ||
            e.updatedAt > syncState.lastSyncedAt!,
        )
      : expenses;

    const response = await fetch(settings.syncUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expenses: changedExpenses, deletedIds: pendingDeleteIds }),
    });

    if (!response.ok) throw new Error(`Sync failed: ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!Array.isArray(data.expenses))
      throw new Error("Invalid sync response");

    replaceExpenses(data.expenses);
    clearPendingDeleteIds();
    setSyncState({
      lastSyncedAt: new Date().toISOString(),
      isSyncing: false,
      error: null,
    });
  } catch (error: any) {
    setSyncState({ isSyncing: false, error: error.message || "Sync failed" });
  }
}
