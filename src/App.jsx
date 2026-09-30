import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LakeCanvas from './components/LakeCanvas';
import GlassHeader from './components/GlassHeader';
import SummaryAnalytics from './components/SummaryAnalytics';
import StickyNoteFormModal from './components/StickyNoteFormModal';
import CorkboardCanvas from './components/CorkboardCanvas';
import FilterBar from './components/FilterBar';

const STORAGE_KEY = 'expense-corkboard-data';
const BUDGET_KEY = 'expense-corkboard-budget';
const CURRENCY_KEY = 'expense-corkboard-currency';

const DEFAULT_EXPENSES = [
  { id: 1, title: 'Grocery Shopping', amount: 85.50, category: 'Food', date: '2026-09-28', pinned: false, position: { x: 0, y: 0 }, noteColor: '#FFF275' },
  { id: 2, title: 'Uber Ride', amount: 24.00, category: 'Transportation', date: '2026-09-27', pinned: true, position: { x: 0, y: 0 }, noteColor: '#70D6FF' },
  { id: 3, title: 'Electric Bill', amount: 120.00, category: 'Utilities', date: '2026-09-25', pinned: false, position: { x: 0, y: 0 }, noteColor: '#FF70A6' },
  { id: 4, title: 'Movie Tickets', amount: 32.00, category: 'Entertainment', date: '2026-09-24', pinned: false, position: { x: 0, y: 0 }, noteColor: '#FF9770' },
  { id: 5, title: 'Pharmacy', amount: 45.75, category: 'Health', date: '2026-09-22', pinned: false, position: { x: 0, y: 0 }, noteColor: '#E9FF70' },
  { id: 6, title: 'Coffee Shop', amount: 18.25, category: 'Food', date: '2026-09-21', pinned: false, position: { x: 0, y: 0 }, noteColor: '#D8B4F8' },
  { id: 7, title: 'Gas Station', amount: 55.00, category: 'Transportation', date: '2026-09-20', pinned: false, position: { x: 0, y: 0 }, noteColor: '#87CEEB' },
  { id: 8, title: 'Internet Bill', amount: 79.99, category: 'Utilities', date: '2026-09-19', pinned: false, position: { x: 0, y: 0 }, noteColor: '#FFB6C1' },
];

function loadExpenses() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load expenses:', e);
  }
  return DEFAULT_EXPENSES;
}

function loadBudget() {
  try {
    const stored = localStorage.getItem(BUDGET_KEY);
    if (stored) {
      return parseFloat(stored) || 1000;
    }
  } catch (e) {
    console.error('Failed to load budget:', e);
  }
  return 1000;
}

function loadCurrency() {
  try {
    const stored = localStorage.getItem(CURRENCY_KEY);
    if (stored) {
      return stored;
    }
  } catch (e) {
    console.error('Failed to load currency:', e);
  }
  return 'USD';
}

let nextId = 100;

function App() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('corkboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budget, setBudget] = useState(loadBudget);
  const [currency, setCurrency] = useState(loadCurrency);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses:', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
    } catch (e) {
      console.error('Failed to save budget:', e);
    }
  }, [budget]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, JSON.stringify(currency));
    } catch (e) {
      console.error('Failed to save currency:', e);
    }
  }, [currency]);

  const filteredExpenses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return expenses
      .filter((expense) => {
        const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
        if (!matchesCategory) return false;
        if (!query) return true;
        const searchableText = [
          expense.title,
          expense.category,
          expense.date,
          expense.amount.toString(),
          expense.amount.toFixed(2),
          new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
          expense.pinned ? 'pinned' : 'unpinned',
        ].join(' ').toLowerCase();
        return searchableText.includes(query);
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.date) - new Date(a.date);
      });
  }, [expenses, searchQuery, categoryFilter]);

  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    expenses.forEach((expense) => {
      if (!breakdown[expense.category]) {
        breakdown[expense.category] = 0;
      }
      breakdown[expense.category] += expense.amount;
    });
    return breakdown;
  }, [expenses]);

  const handleAddExpense = useCallback((newExpense) => {
    setExpenses((prev) => {
      const expense = {
        ...newExpense,
        id: nextId++,
        pinned: false,
        position: { x: 0, y: 0 },
      };
      return [...prev, expense];
    });
  }, []);

  const handleUpdateExpense = useCallback((updatedExpense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    setEditingExpense(null);
  }, []);

  const handleDeleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const handleTogglePin = useCallback((id) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, pinned: !expense.pinned } : expense
      )
    );
  }, []);

  const handleEditFromNote = useCallback((expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  }, []);

  const handlePositionChange = useCallback((id, delta) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? { ...expense, position: { x: expense.position.x + delta.x, y: expense.position.y + delta.y } }
          : expense
      )
    );
  }, []);

  const handleOpenNewExpense = useCallback(() => {
    setEditingExpense(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingExpense(null);
  }, []);

  return (
    <div className="app-container">
      <LakeCanvas />

      <GlassHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewExpense={handleOpenNewExpense}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <SummaryAnalytics
                expenses={expenses}
                totalSpend={totalSpend}
                filteredTotal={filteredTotal}
                categoryBreakdown={categoryBreakdown}
                budget={budget}
                onBudgetChange={setBudget}
                currency={currency}
              />
            </motion.div>
          ) : (
            <motion.div
              key="board"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <FilterBar
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                resultCount={filteredExpenses.length}
              />
              <CorkboardCanvas
                expenses={filteredExpenses}
                onEdit={handleEditFromNote}
                onDelete={handleDeleteExpense}
                onTogglePin={handleTogglePin}
                viewMode={viewMode}
                onPositionChange={handlePositionChange}
                currency={currency}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <StickyNoteFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        editingExpense={editingExpense}
        currency={currency}
      />
    </div>
  );
}

export default App;
