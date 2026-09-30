import { motion } from 'framer-motion';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
];

function GlassHeader({ searchQuery, onSearchChange, viewMode, onViewModeChange, onNewExpense, currency, onCurrencyChange }) {
  return (
    <motion.header
      className="glass-header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    >
      <div className="header-brand">
        <motion.div
          className="brand-icon"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          📌
        </motion.div>
        <div className="brand-text">
          <h1>Expense Corkboard</h1>
          <span>Interactive Financial Workspace</span>
        </div>
      </div>

      <div className="header-search">
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="header-controls">
        <div className="currency-selector">
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            title="Select Currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        <div className="view-switcher">
          {['corkboard', 'matrix', 'dashboard'].map((mode) => (
            <motion.button
              key={mode}
              className={`view-btn ${viewMode === mode ? 'active' : ''}`}
              onClick={() => onViewModeChange(mode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode === 'corkboard' && '📋'}
              {mode === 'matrix' && '📊'}
              {mode === 'dashboard' && '📈'}
              <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          className="new-expense-btn"
          onClick={onNewExpense}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+</span> New Expense
        </motion.button>
      </div>
    </motion.header>
  );
}

export default GlassHeader;
