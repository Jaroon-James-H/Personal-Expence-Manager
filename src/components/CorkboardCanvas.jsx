import { useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import StickyNoteItem from './StickyNoteItem';

function CorkboardCanvas({ expenses, onEdit, onDelete, onTogglePin, viewMode, onPositionChange, currency }) {
  const boardRef = useRef(null);

  if (viewMode === 'matrix') {
    const categories = ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Miscellaneous'];
    return (
      <LayoutGroup>
        <div className="matrix-board" ref={boardRef}>
          {categories.map((category) => {
            const categoryExpenses = expenses.filter((e) => e.category === category);
            return (
              <div key={category} className="matrix-column">
                <div className="matrix-column-header">
                  <h3>{category}</h3>
                  <span className="matrix-count">{categoryExpenses.length}</span>
                </div>
                <div className="matrix-cards">
                  <AnimatePresence mode="popLayout">
                    {categoryExpenses.map((expense) => (
                      <StickyNoteItem
                        key={expense.id}
                        expense={expense}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTogglePin={onTogglePin}
                        viewMode={viewMode}
                        currency={currency}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    );
  }

  return (
    <LayoutGroup>
      <div className="corkboard-canvas" ref={boardRef}>
        <AnimatePresence mode="popLayout">
          {expenses.map((expense) => (
            <StickyNoteItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              viewMode={viewMode}
              onPositionChange={onPositionChange}
              currency={currency}
            />
          ))}
        </AnimatePresence>
        {expenses.length === 0 && (
          <motion.div
            className="empty-corkboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="empty-icon">📋</span>
            <h3>Your corkboard is empty</h3>
            <p>Click "New Expense" to pin your first sticky note!</p>
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}

export default CorkboardCanvas;
