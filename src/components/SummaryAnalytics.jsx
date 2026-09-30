import { motion } from 'framer-motion';
import { useMemo } from 'react';

const CATEGORY_COLORS = {
  Food: '#FFF275',
  Transportation: '#70D6FF',
  Utilities: '#FF70A6',
  Entertainment: '#FF9770',
  Health: '#E9FF70',
  Miscellaneous: '#D8B4F8',
};

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹',
  AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', KRW: '₩',
  BRL: 'R$', MXN: 'MX$', SGD: 'S$', HKD: 'HK$', SEK: 'kr',
  NOK: 'kr', DKK: 'kr', NZD: 'NZ$', ZAR: 'R', THB: '฿',
  PHP: '₱', IDR: 'Rp', MYR: 'RM', PLN: 'zł', TRY: '₺',
};

function formatCurrency(amount, currency = 'USD') {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
}

function SummaryAnalytics({ expenses, totalSpend, filteredTotal, categoryBreakdown, budget, onBudgetChange, currency }) {
  const categoryEntries = useMemo(() => {
    return Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]);
  }, [categoryBreakdown]);

  const averageExpense = expenses.length > 0 ? totalSpend / expenses.length : 0;
  const highestCategory = categoryEntries.length > 0 ? categoryEntries[0] : null;
  const budgetPercentage = budget > 0 ? Math.min((totalSpend / budget) * 100, 100) : 0;
  const isOverBudget = totalSpend > budget && budget > 0;

  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter((e) => e.date === today);
  const dailyVelocity = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = expenses.filter((e) => e.date === dateStr);
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      days.push({
        date: dateStr,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total,
        count: dayExpenses.length,
      });
    }
    return days;
  }, [expenses]);

  const maxDayTotal = Math.max(...last7Days.map((d) => d.total), 1);

  const monthlyData = useMemo(() => {
    const months = {};
    expenses.forEach((e) => {
      const month = e.date.substring(0, 7);
      if (!months[month]) months[month] = 0;
      months[month] += e.amount;
    });
    return Object.entries(months).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);
  }, [expenses]);

  const maxMonthly = Math.max(...monthlyData.map(([, amount]) => amount), 1);

  let cumulativeOffset = 0;
  const donutSegments = categoryEntries.map(([category, amount]) => {
    const percentage = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
    const segment = {
      category,
      amount,
      percentage,
      offset: cumulativeOffset,
      color: CATEGORY_COLORS[category] || '#95a5a6',
    };
    cumulativeOffset += percentage;
    return segment;
  });

  const pinnedCount = expenses.filter((e) => e.pinned).length;

  return (
    <motion.div
      className="summary-analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="analytics-title">Financial Command Center</h2>

      <div className="analytics-grid">
        <motion.div
          className="analytics-card neumorphic"
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          <span className="card-label">Total Spend</span>
          <motion.span
            className="card-value"
            key={totalSpend}
            initial={{ scale: 1.2, color: '#4f46e5' }}
            animate={{ scale: 1, color: '#1f2937' }}
            transition={{ duration: 0.3 }}
          >
            {formatCurrency(totalSpend, currency)}
          </motion.span>
          <span className="card-sublabel">{expenses.length} transactions</span>
        </motion.div>

        <motion.div
          className="analytics-card neumorphic"
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          <span className="card-label">Average Expense</span>
          <span className="card-value">{formatCurrency(averageExpense, currency)}</span>
          <span className="card-sublabel">per transaction</span>
        </motion.div>

        <motion.div
          className="analytics-card neumorphic"
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          <span className="card-label">Top Category</span>
          <span className="card-value category-highlight" style={{ color: highestCategory ? CATEGORY_COLORS[highestCategory[0]] : '#6b7280' }}>
            {highestCategory ? highestCategory[0] : 'N/A'}
          </span>
          <span className="card-sublabel">{highestCategory ? formatCurrency(highestCategory[1], currency) : ''}</span>
        </motion.div>

        <motion.div
          className="analytics-card neumorphic"
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          <span className="card-label">Today's Spend</span>
          <span className="card-value">{formatCurrency(dailyVelocity, currency)}</span>
          <span className="card-sublabel">{todayExpenses.length} transaction{todayExpenses.length !== 1 ? 's' : ''}</span>
        </motion.div>

        <motion.div
          className="analytics-card neumorphic"
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          <span className="card-label">Pinned Notes</span>
          <span className="card-value">{pinnedCount}</span>
          <span className="card-sublabel">priority expenses</span>
        </motion.div>

        <motion.div
          className="analytics-card neumorphic"
          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}
        >
          <span className="card-label">Daily Average</span>
          <span className="card-value">{formatCurrency(totalSpend / Math.max(expenses.length, 1), currency)}</span>
          <span className="card-sublabel">per day</span>
        </motion.div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container neumorphic">
          <h3>Category Distribution</h3>
          <div className="donut-chart-wrapper">
            <svg viewBox="0 0 200 200" className="donut-chart">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
              {donutSegments.map((segment) => {
                const circumference = 2 * Math.PI * 80;
                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -(segment.offset / 100) * circumference;
                return (
                  <motion.circle
                    key={segment.category}
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="30"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ filter: `drop-shadow(0 0 6px ${segment.color}40)` }}
                  />
                );
              })}
            </svg>
            <div className="donut-center">
              <span className="donut-total">{formatCurrency(totalSpend, currency)}</span>
              <span className="donut-label">Total</span>
            </div>
          </div>
          <div className="category-pills">
            {categoryEntries.map(([category, amount]) => (
              <motion.div
                key={category}
                className="category-pill"
                whileHover={{ scale: 1.05 }}
                style={{ borderColor: CATEGORY_COLORS[category] }}
              >
                <span className="pill-dot" style={{ backgroundColor: CATEGORY_COLORS[category] }}></span>
                <span className="pill-label">{category}</span>
                <span className="pill-amount">{formatCurrency(amount, currency)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="chart-container neumorphic">
          <h3>7-Day Spending Trend</h3>
          <div className="trend-chart">
            <div className="trend-bars">
              {last7Days.map((day, index) => (
                <motion.div
                  key={day.date}
                  className="trend-bar-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="trend-bar-track">
                    <motion.div
                      className="trend-bar"
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.total / maxDayTotal) * 100}%` }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    />
                  </div>
                  <span className="trend-label">{day.label}</span>
                  <span className="trend-value">{formatCurrency(day.total, currency)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container neumorphic">
          <h3>Monthly Overview</h3>
          <div className="monthly-chart">
            {monthlyData.map(([month, amount], index) => (
              <motion.div
                key={month}
                className="monthly-bar-wrapper"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="monthly-info">
                  <span className="monthly-label">{new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
                  <span className="monthly-amount">{formatCurrency(amount, currency)}</span>
                </div>
                <div className="monthly-track">
                  <motion.div
                    className="monthly-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${(amount / maxMonthly) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="chart-container neumorphic">
          <h3>Budget Thermometer</h3>
          <div className="budget-input-group">
            <label htmlFor="budget-input">Monthly Budget Target</label>
            <div className="budget-input-wrapper">
              <span>{CURRENCY_SYMBOLS[currency] || '$'}</span>
              <input
                type="number"
                id="budget-input"
                value={budget}
                onChange={(e) => onBudgetChange(parseFloat(e.target.value) || 0)}
                placeholder="Set budget..."
                min="0"
                step="50"
              />
            </div>
          </div>
          <div className="budget-gauge">
            <div className="gauge-track">
              <motion.div
                className={`gauge-fill ${isOverBudget ? 'over-budget' : ''}`}
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <div className="gauge-markers">
                {[25, 50, 75].map((mark) => (
                  <span key={mark} className="gauge-marker" style={{ left: `${mark}%` }}>
                    {mark}%
                  </span>
                ))}
              </div>
            </div>
            <div className="gauge-labels">
              <span>{formatCurrency(totalSpend, currency)}</span>
              <span className={isOverBudget ? 'over-budget-text' : ''}>
                {isOverBudget ? 'OVER BUDGET!' : `${formatCurrency(budget, currency)}`}
              </span>
            </div>
          </div>
          {isOverBudget && (
            <motion.div
              className="budget-warning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ You've exceeded your budget by {formatCurrency(totalSpend - budget, currency)}
            </motion.div>
          )}
          <div className="budget-stats">
            <div className="budget-stat">
              <span className="stat-label">Remaining</span>
              <span className="stat-value">{formatCurrency(Math.max(budget - totalSpend, 0), currency)}</span>
            </div>
            <div className="budget-stat">
              <span className="stat-label">Daily Allowance</span>
              <span className="stat-value">{formatCurrency(Math.max((budget - totalSpend) / 30, 0), currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SummaryAnalytics;
