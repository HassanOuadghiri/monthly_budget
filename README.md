# Monthly Budget Expenses Tracker

A modern, responsive web-based budget tracker built with HTML, CSS, and JavaScript. Track your monthly expenses, categorize them, and monitor your budget with beautiful visual feedback and real-time updates.

## Features

- 🌐 Modern, responsive web interface
- 💱 **Multi-currency support** (USD, EUR, PLN, MAD)
- 📊 **Interactive pie chart** for spending categories
- 📱 Mobile-friendly design that works on all devices
- 📈 Interactive budget overview with progress bars
- 💰 Add/delete expenses with real-time updates
- 🎨 Beautiful gradient design and smooth animations
- 🔔 Toast notifications for user feedback
- 💾 Browser localStorage for data persistence (no server needed)
- ⚠️ Smart budget alerts and warnings
- 🖱️ Click-to-delete expense functionality
- ⌨️ Keyboard shortcuts (Ctrl+Enter to add expense)
- 📊 Real-time budget usage visualization
- 🎯 Intuitive user experience with modern UI/UX

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - just open `index.html` in your browser
- Works offline after initial load

### Installation and Usage

1. **Open the web app:**
   - Simply double-click `index.html` to open in your default browser
   - Or drag and drop `index.html` into any browser window
   - For best experience, use Chrome or Firefox

2. **How to use:**
   - **Select Currency**: Choose your preferred currency (USD, EUR, PLN, MAD) from the dropdown
   - **Set Budget**: Enter your monthly budget amount and click "Set Budget"
   - **Add Expenses**: Fill in amount, select category, add description (optional), and click "Add Expense"
   - **View Summary**: Your budget overview updates automatically with spending progress
   - **Delete Expenses**: Click the trash icon next to any expense to delete it
   - **Clear All**: Use the "Clear All" button to remove all expenses for the current month

3. **Features:**
   - Multi-currency support (USD, EUR, PLN, MAD) with proper formatting
   - Interactive pie chart showing spending distribution by category
   - Real-time budget tracking with visual progress bars
   - Automatic budget warnings when you approach or exceed limits
   - Responsive design that works on desktop, tablet, and mobile
   - Data automatically saves in your browser (localStorage)
   - Toast notifications for all actions
   - Keyboard shortcuts: Ctrl+Enter to quickly add expenses

4. **Example Workflow:**
   ```
   1. Open index.html in your browser
   2. Select your preferred currency (e.g., EUR for Europe)
   3. Set your monthly budget (e.g., €1500)
   4. Add expenses as you spend:
      - €45 for Food - "Groceries at supermarket"
      - €20 for Transportation - "Bus pass"
      - €80 for Shopping - "New jacket"
   5. Monitor your spending with the visual progress bar
   6. View pie chart to see spending distribution across categories
   ```

5. **Try the Demo:**
   - Open `demo.html` for a quick introduction
   - Click "Load Sample Data" to see the app with example expenses
   - Then open `index.html` to see the tracker in action

## Default Categories

The budget tracker comes with the following predefined categories:
- 🍽️ Food
- 🚗 Transportation  
- 🏠 Housing
- ⚡ Utilities
- 🎬 Entertainment
- 🏥 Healthcare
- 🛍️ Shopping
- 📝 Other

You can add expenses to any of these categories, and the system will automatically track and visualize your spending patterns.

## File Structure

```
budget/
├── index.html             # Main budget tracker application
├── styles.css             # CSS styling and responsive design
├── script.js              # JavaScript functionality and logic
├── demo.html              # Demo page with sample data
├── README.md              # This documentation file
├── .gitignore             # Git ignore rules
└── .vscode/               # VS Code workspace settings
```

Note: Data is automatically stored in your browser's localStorage - no external files needed!

## Tips for Usage

1. **Start with setting your budget** - The visual progress bars make it easy to track your spending
2. **Use descriptive categories** to better understand your spending patterns  
3. **Add expenses immediately** - The quick form makes it easy to log purchases on the spot
4. **Watch the progress bar** - Visual feedback helps you stay aware of your spending
5. **Use on mobile** - The responsive design works great on phones for on-the-go expense tracking
6. **Try the demo** - Use `demo.html` to load sample data and explore all features
7. **Use keyboard shortcuts** - Press Ctrl+Enter to quickly add expenses
8. **Monitor category breakdown** - See which categories consume most of your budget

## Troubleshooting

1. **Data not saving**
   - Make sure your browser allows localStorage
   - Check if you're in private/incognito mode (data won't persist)
   - Try refreshing the page

2. **Visual elements not loading**
   - Ensure you have an internet connection for Font Awesome icons and Chart.js
   - Try opening in a different browser
   - Check browser console for any errors

3. **Mobile display issues**
   - Try rotating your device to landscape mode
   - Zoom out if elements appear too large
   - Use a modern mobile browser

4. **App not working properly**
   - Clear your browser's localStorage data for the site
   - Make sure JavaScript is enabled in your browser
   - Try using a different browser (Chrome or Firefox recommended)

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling, gradients, and responsive design
- **JavaScript (ES6+)** - Interactive functionality and data management
- **Chart.js** - Interactive pie charts for spending visualization
- **Font Awesome** - Beautiful icons throughout the interface
- **LocalStorage API** - Client-side data persistence

## Contributing

Feel free to submit issues and enhancement requests! This project welcomes contributions.

## License

This project is open source and available under the [MIT License](LICENSE).

---

### 🚀 Live Demo

Simply download the files and open `index.html` in your browser to start tracking your budget!