Personal Expense Manager
An interactive corkboard-style expense management application built with React. Track daily spending through drag-and-drop sticky notes on a virtual lake background with real-time analytics and multi-currency support.
What It Is
A single-page React application that transforms expense tracking into a visual, tactile workspace. Expenses are represented as colorful sticky notes pinned to a digital corkboard. The background features a realistic animated lake with Koi fish, a blue whale, and an octopus that reacts to cursor movement.
What It Is Used For
- Recording daily expenses with title, amount, category, date, and custom note color
- Organizing expenses visually on a corkboard, in category columns (matrix view), or in a financial dashboard
- Tracking total spending, daily velocity, budget targets, and category breakdowns
- Managing expense records through inline editing, pinning, and deletion
- Converting between 25 world currencies with real-time symbol updates
What Problems It Solves
- Makes expense tracking engaging instead of tedious through gamified visual interface
- Eliminates the need for spreadsheets or notebooks by providing a persistent, organized digital workspace
- Helps users understand spending patterns through interactive donut charts, trend graphs, and budget thermometers
- Provides instant search across all expense fields including title, category, date, amount, and status
- Stores data permanently in the browser using localStorage so no backend is required
How It Is Helpful
- Drag-and-drop sticky notes allow freeform organization of expenses
- Pin important expenses to keep them visible at the top of the list
- Real-time filtering by category and search query updates totals instantly
- Budget thermometer with glow alerts warns when spending exceeds targets
- Multi-currency support makes it usable worldwide
- Three view modes (Corkboard, Matrix, Dashboard) suit different organizational preferences
Technologies Used
- React 18 with Vite for fast development and building
- Framer Motion for spring-based animations, layout transitions, and 3D transforms
- HTML5 Canvas for realistic fish, whale, octopus, bubbles, and water ripple rendering
- localStorage for permanent client-side data persistence
- Intl.NumberFormat for multi-currency formatting
- CSS custom properties, glassmorphism, and neumorphism for visual design
- SVG for animated donut charts and data visualization
How to Run
Prerequisites: Node.js 18 or higher, npm/yarn/pnpm
Installation:
cd D:\personal-expence-manager
npm install
Development:
npm run dev
Production:
npm run build
npm run preview
Getting Started:
1. Click "New Expense" to pin your first sticky note
2. Drag notes anywhere on the corkboard to organize them
3. Click the pin to mark expenses as priority
4. Click the edit icon to flip the note and modify details
5. Use the search bar to find expenses by any field
6. Switch between Corkboard, Matrix, and Dashboard views
7. Change currency from the dropdown in the header
8. Set a monthly budget in the Dashboard to track spending goals
