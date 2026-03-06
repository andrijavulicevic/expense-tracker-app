export default {
  // Tabs
  tabs: {
    home: 'Home',
    stats: 'Stats',
    settings: 'Settings',
  },

  // Onboarding
  onboarding: {
    title: 'Expense Tracker',
    subtitle: 'Track your spending with ease.\nEnter your name and pick a currency to get started.',
    namePlaceholder: 'Your name',
    start: 'Start Tracking',
  },

  // Home
  home: {
    noExpenses: 'No expenses yet',
    trackFirst: 'Track your first expense',
    deleteTitle: 'Delete Expense',
    deleteMessage: 'Are you sure?',
    cancel: 'Cancel',
    delete: 'Delete',
  },

  // Stats
  stats: {
    noExpenses: 'No expenses this month',
    dailyAverage: 'Daily average',
    averageText: 'You spend on average %{amount} per day this month',
    categoryExpenses: '%{category} Expenses',
    done: 'Done',
    noCategory: 'No expenses in this category',
  },

  // Add / Edit Expense
  expense: {
    add: 'Add Expense',
    edit: 'Edit Expense',
    cancel: 'Cancel',
    save: 'Save',
    update: 'Update',
    delete: 'Delete Expense',
    deleteMessage: 'Are you sure you want to delete this expense?',
    titlePlaceholder: 'Title (e.g. Groceries)',
    notePlaceholder: 'Add a note...',
    yesterday: 'Yesterday',
    today: 'Today',
    addedBy: 'Added by %{name}',
  },

  // Spent Card
  spent: {
    thisMonth: 'Spent this month',
    morePercent: '↑ %{percentage}% more than last month',
    lessPercent: '↓ %{percentage}% less than last month',
  },

  // Donut Chart
  chart: {
    total: 'Total',
  },

  // Settings
  settings: {
    title: 'Settings',
    name: 'Name',
    namePlaceholder: 'Your name',
    language: 'Language',
    currency: 'Currency',
    auto: 'Auto (device)',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    sync: 'Google Sheets Sync',
    syncUrlPlaceholder: 'Paste Google Apps Script URL',
    syncNow: 'Sync Now',
    syncing: 'Syncing...',
    lastSynced: 'Last synced: %{time}',
    syncError: 'Sync failed',
    manageCategories: 'Manage Categories',
  },

  // Manage Categories
  manageCategories: {
    title: 'Manage Categories',
    addNew: 'Add Category',
    name: 'Category Name',
    icon: 'Icon',
    color: 'Color',
    save: 'Save',
    delete: 'Delete',
    deleteTitle: 'Delete Category',
    deleteMessage: 'Expenses using this category will show as unknown.',
    cancel: 'Cancel',
    duplicateKey: 'A category with this name already exists.',
  },

  // Categories
  categories: {
    food: 'Food',
    transport: 'Transport',
    bills: 'Bills',
    shopping: 'Shopping',
    health: 'Health',
    fun: 'Fun',
    travel: 'Travel',
    subscriptions: 'Subscriptions',
    other: 'Other',
  },

  // Currencies
  currencies: {
    RSD: 'Serbian Dinar (RSD)',
    EUR: 'Euro (EUR)',
    USD: 'US Dollar (USD)',
  },

  // Dates
  dates: {
    today: 'Today',
    yesterday: 'Yesterday',
  },
};
