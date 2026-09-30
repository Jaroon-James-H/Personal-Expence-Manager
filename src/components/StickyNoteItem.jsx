import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

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

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getContrastColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

function StickyNoteItem({ expense, onEdit, onDelete, onTogglePin, viewMode, onPositionChange, currency }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCrumpling, setIsCrumpling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editData, setEditData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    category: expense.category,
    date: expense.date,
    noteColor: expense.noteColor || '#FFF275',
  });
  const noteRef = useRef(null);

  const noteColor = expense.noteColor || '#FFF275';
  const textColor = getContrastColor(noteColor);
  const randomRotation = useRef((Math.random() - 0.5) * 5);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 30 });
  const springY = useSpring(y, { stiffness: 500, damping: 30 });

  const rotateX = useTransform(springY, [-100, 100], [8, -8]);
  const rotateY = useTransform(springX, [-100, 100], [-8, 8]);

  useEffect(() => {
    setEditData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      noteColor: expense.noteColor || '#FFF275',
    });
  }, [expense]);

  function handleFlip() {
    setIsFlipped(true);
  }

  function handleFlipBack() {
    setIsFlipped(false);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditSave() {
    if (!editData.title.trim() || !editData.amount || parseFloat(editData.amount) <= 0) return;
    onEdit({
      ...expense,
      title: editData.title.trim(),
      amount: parseFloat(editData.amount),
      category: editData.category,
      date: editData.date,
      noteColor: editData.noteColor,
    });
    setIsFlipped(false);
  }

  function handleDelete() {
    setIsCrumpling(true);
    setTimeout(() => {
      onDelete(expense.id);
    }, 500);
  }

  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDragEnd(_, info) {
    setIsDragging(false);
    if (viewMode === 'corkboard' && onPositionChange) {
      onPositionChange(expense.id, { x: info.offset.x, y: info.offset.y });
    }
  }

  const noteStyle = {
    '--note-color': noteColor,
    '--text-color': textColor,
  };

  return (
    <motion.div
      ref={noteRef}
      className={`sticky-note-wrapper ${expense.pinned ? 'pinned' : ''} ${isDragging ? 'dragging' : ''}`}
      style={noteStyle}
      layout
      layoutId={`note-${expense.id}`}
      initial={{ opacity: 0, scale: 0.5, rotate: randomRotation.current * 2 }}
      animate={{
        opacity: isCrumpling ? 0 : 1,
        scale: isCrumpling ? 0 : 1,
        rotate: isCrumpling ? 360 : randomRotation.current,
      }}
      exit={{ opacity: 0, scale: 0, rotate: -randomRotation.current * 2 }}
      transition={{
        layout: { type: 'spring', stiffness: 350, damping: 28 },
        opacity: { duration: 0.3 },
        scale: { type: 'spring', stiffness: 350, damping: 22 },
        rotate: { type: 'spring', stiffness: 250, damping: 18 },
      }}
      drag={viewMode === 'corkboard'}
      dragMomentum={false}
      dragElastic={0.05}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
      }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className={`sticky-note ${isFlipped ? 'flipped' : ''}`}>
        <div className="note-front">
          <div className={`push-pin ${isDragging ? 'pin-active' : ''}`} onClick={() => onTogglePin(expense.id)}>
            <div className="pin-head"></div>
            <div className="pin-point"></div>
          </div>

          <div className="tape-strip"></div>

          <div className="note-content">
            <span className="note-category">{expense.category}</span>
            <h3 className="note-title">{expense.title}</h3>
            <span className="note-date">{formatDate(expense.date)}</span>
          </div>

          <div className="note-footer">
            <span className="note-amount">{formatCurrency(expense.amount, currency)}</span>
            <div className="note-actions">
              <motion.button
                className="note-btn edit-btn"
                onClick={handleFlip}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title="Edit"
              >
                ✏️
              </motion.button>
              <motion.button
                className="note-btn delete-btn"
                onClick={handleDelete}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                title="Delete"
              >
                🗑️
              </motion.button>
            </div>
          </div>
        </div>

        <div className="note-back">
          <div className="edit-form">
            <h4>Edit Expense</h4>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              placeholder="Title"
            />
            <input
              type="number"
              name="amount"
              value={editData.amount}
              onChange={handleEditChange}
              placeholder="Amount"
              step="0.01"
              min="0"
            />
            <select
              name="category"
              value={editData.category}
              onChange={handleEditChange}
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <input
              type="date"
              name="date"
              value={editData.date}
              onChange={handleEditChange}
            />
            <div className="edit-color-picker">
              {['#FFF275', '#70D6FF', '#FF70A6', '#FF9770', '#E9FF70', '#D8B4F8', '#87CEEB', '#FFB6C1', '#6B4C9A', '#1B3A5C'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`edit-color-swatch ${editData.noteColor === color ? 'selected' : ''}`}
                  onClick={() => setEditData((prev) => ({ ...prev, noteColor: color }))}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="edit-actions">
              <motion.button
                className="save-btn"
                onClick={handleEditSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                className="cancel-btn"
                onClick={handleFlipBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StickyNoteItem;
