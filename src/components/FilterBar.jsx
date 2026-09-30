import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Miscellaneous'];

function FilterBar({ categoryFilter, onCategoryChange, resultCount }) {
  return (
    <motion.div
      className="filter-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="filter-pills">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            {categoryFilter === cat && (
              <motion.div
                className="pill-indicator"
                layoutId="activePill"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span>{cat}</span>
          </motion.button>
        ))}
      </div>
      <span className="filter-count">{resultCount} note{resultCount !== 1 ? 's' : ''}</span>
    </motion.div>
  );
}

export default FilterBar;
