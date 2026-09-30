import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Miscellaneous'];

const NOTE_COLORS = [
  { name: 'Canary Yellow', value: '#FFF275', textColor: '#1a1a2e' },
  { name: 'Electric Cyan', value: '#70D6FF', textColor: '#1a1a2e' },
  { name: 'Coral Pink', value: '#FF70A6', textColor: '#1a1a2e' },
  { name: 'Sunset Orange', value: '#FF9770', textColor: '#1a1a2e' },
  { name: 'Emerald Green', value: '#E9FF70', textColor: '#1a1a2e' },
  { name: 'Lavender', value: '#D8B4F8', textColor: '#1a1a2e' },
  { name: 'Sky Blue', value: '#87CEEB', textColor: '#1a1a2e' },
  { name: 'Peach', value: '#FFCBA4', textColor: '#1a1a2e' },
  { name: 'Mint', value: '#98FB98', textColor: '#1a1a2e' },
  { name: 'Rose', value: '#FFB6C1', textColor: '#1a1a2e' },
  { name: 'Deep Purple', value: '#6B4C9A', textColor: '#ffffff' },
  { name: 'Navy Blue', value: '#1B3A5C', textColor: '#ffffff' },
  { name: 'Forest Green', value: '#2D5A3D', textColor: '#ffffff' },
  { name: 'Burgundy', value: '#722F37', textColor: '#ffffff' },
  { name: 'Charcoal', value: '#36454F', textColor: '#ffffff' },
  { name: 'Chocolate', value: '#5C4033', textColor: '#ffffff' },
  { name: 'Teal', value: '#008080', textColor: '#ffffff' },
  { name: 'Crimson', value: '#8B0000', textColor: '#ffffff' },
  { name: 'Slate', value: '#708090', textColor: '#ffffff' },
  { name: 'Olive', value: '#556B2F', textColor: '#ffffff' },
];

function StickyNoteFormModal({ isOpen, onClose, onAddExpense, onUpdateExpense, editingExpense, currency }) {
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '', noteColor: '#FFF275' });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingExpense) {
        setFormData({
          title: editingExpense.title,
          amount: editingExpense.amount.toString(),
          category: editingExpense.category,
          date: editingExpense.date,
          noteColor: editingExpense.noteColor || '#FFF275',
        });
        setIsEditing(true);
      } else {
        setFormData({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], noteColor: '#FFF275' });
        setIsEditing(false);
      }
      setErrors({});
    }
  }, [isOpen, editingExpense]);

  function validateForm() {
    const newErrors = {};
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    const amountNum = parseFloat(formData.amount);
    if (formData.amount === '' || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Amount must be positive';
    }
    if (!formData.category) {
      newErrors.category = 'Select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const expenseData = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      noteColor: formData.noteColor,
    };

    if (isEditing && editingExpense) {
      onUpdateExpense({ ...expenseData, id: editingExpense.id });
    } else {
      onAddExpense(expenseData);
    }
    onClose();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  const selectedColorObj = NOTE_COLORS.find((c) => c.value === formData.noteColor) || NOTE_COLORS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="sticky-form-modal"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="modal-header" style={{ borderBottomColor: formData.noteColor }}>
              <h2>{isEditing ? 'Edit Expense' : 'New Expense'}</h2>
              <button className="modal-close" onClick={onClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="modal-title">Title</label>
                <input
                  type="text"
                  id="modal-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What did you spend on?"
                  className={errors.title ? 'input-error' : ''}
                  autoFocus
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modal-amount">Amount</label>
                  <input
                    type="number"
                    id="modal-amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={errors.amount ? 'input-error' : ''}
                  />
                  {errors.amount && <span className="error-message">{errors.amount}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="modal-date">Date</label>
                  <input
                    type="date"
                    id="modal-date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={errors.date ? 'input-error' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <div className="category-selector">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat}
                      type="button"
                      className={`category-option ${formData.category === cat ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, category: cat }));
                        if (errors.category) {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.category;
                            return updated;
                          });
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: formData.category === cat ? '#4f46e5' : 'transparent',
                        borderColor: '#4f46e5',
                        color: formData.category === cat ? '#fff' : 'inherit',
                      }}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label>Note Color</label>
                <div className="color-picker-grid">
                  {NOTE_COLORS.map((color) => (
                    <motion.button
                      key={color.value}
                      type="button"
                      className={`color-swatch ${formData.noteColor === color.value ? 'selected' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, noteColor: color.value }))}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {formData.noteColor === color.value && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ color: color.textColor }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <motion.button
                  type="submit"
                  className="btn-submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ backgroundColor: formData.noteColor, color: selectedColorObj.textColor }}
                >
                  {isEditing ? 'Update Expense' : 'Pin to Board'}
                </motion.button>
                <motion.button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StickyNoteFormModal;
