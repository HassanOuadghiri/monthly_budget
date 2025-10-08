// Budget Tracker JavaScript

class BudgetTracker {
    constructor() {
        this.currencies = {
            USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
            EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
            PLN: { symbol: 'zł', code: 'PLN', name: 'Polish Złoty' },
            MAD: { symbol: 'DH', code: 'MAD', name: 'Moroccan Dirham' }
        };
        
        this.categoryColors = {
            'Food': '#FF6384',
            'Transportation': '#36A2EB', 
            'Housing': '#FFCE56',
            'Utilities': '#4BC0C0',
            'Entertainment': '#9966FF',
            'Healthcare': '#FF9F40',
            'Shopping': '#FF6384',
            'Other': '#C9CBCF'
        };
        
        this.data = this.loadData();
        this.chart = null;
        this.initializeEventListeners();
        this.updateCurrencyDisplay();
        this.updateDisplay();
    }

    // Data Management
    loadData() {
        const defaultData = {
            monthlyBudget: 0,
            expenses: [],
            categories: [
                'Food', 'Transportation', 'Housing', 'Utilities',
                'Entertainment', 'Healthcare', 'Shopping', 'Other'
            ],
            selectedCurrency: 'USD'
        };

        try {
            const savedData = localStorage.getItem('budgetTrackerData');
            return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
        } catch (error) {
            console.error('Error loading data:', error);
            return defaultData;
        }
    }

    saveData() {
        try {
            localStorage.setItem('budgetTrackerData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error saving data', 'error');
        }
    }

    // Event Listeners
    initializeEventListeners() {
        // Currency selection
        document.getElementById('currencySelect').addEventListener('change', () => this.changeCurrency());
        
        // Budget setup
        document.getElementById('setBudgetBtn').addEventListener('click', () => this.setBudget());
        document.getElementById('budgetAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setBudget();
        });

        // Expense form
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Clear all expenses
        document.getElementById('clearAllBtn').addEventListener('click', () => this.confirmClearAll());

        // Modal events
        document.getElementById('confirmYes').addEventListener('click', () => this.executeConfirmAction());
        document.getElementById('confirmNo').addEventListener('click', () => this.hideModal());

        // Close modal when clicking outside
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') this.hideModal();
        });
    }

    // Currency Management
    changeCurrency() {
        const selectedCurrency = document.getElementById('currencySelect').value;
        this.data.selectedCurrency = selectedCurrency;
        this.saveData();
        this.updateCurrencyDisplay();
        this.updateDisplay();
        this.showToast(`Currency changed to ${this.currencies[selectedCurrency].name}`, 'success');
    }

    updateCurrencyDisplay() {
        const currency = this.data.selectedCurrency;
        const symbol = this.currencies[currency].symbol;
        
        // Update currency selector
        document.getElementById('currencySelect').value = currency;
        
        // Update currency symbol in expense form
        document.getElementById('currencySymbol').textContent = symbol;
        
        // Update budget amount placeholder
        const budgetInput = document.getElementById('budgetAmount');
        budgetInput.placeholder = `Enter your monthly budget in ${currency}`;
    }

    formatCurrency(amount) {
        const currency = this.data.selectedCurrency;
        const currencyInfo = this.currencies[currency];
        
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        } catch (error) {
            // Fallback for currencies not supported by Intl.NumberFormat
            return `${currencyInfo.symbol}${amount.toFixed(2)}`;
        }
    }

    // Budget Management
    setBudget() {
        const budgetInput = document.getElementById('budgetAmount');
        const amount = parseFloat(budgetInput.value);

        if (isNaN(amount) || amount <= 0) {
            this.showToast('Please enter a valid budget amount', 'error');
            return;
        }

        this.data.monthlyBudget = amount;
        this.saveData();
        this.updateDisplay();
        budgetInput.value = '';
        this.showToast(`Monthly budget set to ${this.formatCurrency(amount)}`, 'success');
    }

    // Expense Management
    addExpense() {
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const description = document.getElementById('expenseDescription').value.trim();

        if (isNaN(amount) || amount <= 0) {
            this.showToast('Please enter a valid amount', 'error');
            return;
        }

        if (!category) {
            this.showToast('Please select a category', 'error');
            return;
        }

        const expense = {
            id: Date.now(),
            amount: amount,
            category: category,
            description: description,
            date: new Date().toISOString()
        };

        this.data.expenses.unshift(expense); // Add to beginning for recent display
        this.saveData();
        this.updateDisplay();
        this.clearExpenseForm();
        this.showToast(`Added ${this.formatCurrency(amount)} expense for ${category}`, 'success');

        // Check budget warnings
        this.checkBudgetWarnings();
    }

    deleteExpense(expenseId) {
        this.data.expenses = this.data.expenses.filter(expense => expense.id !== expenseId);
        this.saveData();
        this.updateDisplay();
        this.showToast('Expense deleted', 'success');
    }

    clearExpenseForm() {
        document.getElementById('expenseForm').reset();
    }

    // Data Calculations
    getCurrentMonthExpenses() {
        const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
        return this.data.expenses.filter(expense => 
            expense.date.substring(0, 7) === currentMonth
        );
    }

    getTotalSpent() {
        return this.getCurrentMonthExpenses().reduce((total, expense) => total + expense.amount, 0);
    }

    getRemainingBudget() {
        return this.data.monthlyBudget - this.getTotalSpent();
    }

    getBudgetUsedPercentage() {
        if (this.data.monthlyBudget === 0) return 0;
        return (this.getTotalSpent() / this.data.monthlyBudget) * 100;
    }

    getCategoryTotals() {
        const currentExpenses = this.getCurrentMonthExpenses();
        const categoryTotals = {};

        currentExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        return Object.entries(categoryTotals)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);
    }

    // Display Updates
    updateDisplay() {
        this.updateBudgetOverview();
        this.updateExpensesList();
        this.updateCategoryBreakdown();
    }

    updateBudgetOverview() {
        const totalSpent = this.getTotalSpent();
        const remaining = this.getRemainingBudget();
        const budgetUsed = this.getBudgetUsedPercentage();

        // Update amounts
        document.getElementById('totalBudget').textContent = this.formatCurrency(this.data.monthlyBudget);
        document.getElementById('totalSpent').textContent = this.formatCurrency(totalSpent);
        document.getElementById('remaining').textContent = this.formatCurrency(remaining);
        document.getElementById('budgetUsed').textContent = `${budgetUsed.toFixed(1)}%`;

        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${Math.min(budgetUsed, 100)}%`;
        progressText.textContent = `${budgetUsed.toFixed(1)}% used`;

        // Add warning classes based on budget usage
        const cards = document.querySelectorAll('.overview-card');
        const progressBar = document.querySelector('.progress-fill');
        
        // Remove existing warning classes
        cards.forEach(card => {
            card.classList.remove('warning', 'danger');
        });
        progressBar.classList.remove('warning', 'danger');

        if (budgetUsed >= 100) {
            cards[2].classList.add('danger'); // Remaining budget card
            cards[3].classList.add('danger'); // Budget used card
            progressBar.classList.add('danger');
        } else if (budgetUsed >= 80) {
            cards[2].classList.add('warning'); // Remaining budget card
            cards[3].classList.add('warning'); // Budget used card
            progressBar.classList.add('warning');
        }
    }

    updateExpensesList() {
        const expensesList = document.getElementById('expensesList');
        const currentExpenses = this.getCurrentMonthExpenses();

        if (currentExpenses.length === 0) {
            expensesList.innerHTML = `
                <div class="no-expenses">
                    <i class="fas fa-inbox"></i>
                    <p>No expenses recorded yet</p>
                    <small>Add your first expense above to get started</small>
                </div>
            `;
            return;
        }

        expensesList.innerHTML = currentExpenses.slice(0, 10).map(expense => `
            <div class="expense-item slide-in">
                <div class="expense-details">
                    <div class="expense-main">
                        <div>
                            <span class="expense-category">${this.getCategoryIcon(expense.category)} ${expense.category}</span>
                        </div>
                        <span class="expense-amount">${this.formatCurrency(expense.amount)}</span>
                    </div>
                    ${expense.description ? `<div class="expense-description">${expense.description}</div>` : ''}
                    <div class="expense-date">${this.formatDate(expense.date)}</div>
                </div>
                <div class="expense-actions">
                    <button class="btn btn-danger btn-small" onclick="budgetTracker.confirmDeleteExpense(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCategoryBreakdown() {
        const categoryTotals = this.getCategoryTotals();
        const totalSpent = this.getTotalSpent();
        const chartLegend = document.getElementById('chartLegend');

        if (categoryTotals.length === 0) {
            // Hide chart and show no data message
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            
            chartLegend.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-chart-pie"></i>
                    <p>No spending data available</p>
                    <small>Add some expenses to see category breakdown</small>
                </div>
            `;
            return;
        }

        // Prepare chart data
        const chartData = {
            labels: categoryTotals.map(item => item.category),
            datasets: [{
                data: categoryTotals.map(item => item.amount),
                backgroundColor: categoryTotals.map(item => this.categoryColors[item.category] || '#C9CBCF'),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff'
            }]
        };

        // Chart configuration
        const chartConfig = {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // We'll create custom legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const percentage = ((context.parsed / totalSpent) * 100).toFixed(1);
                                return `${context.label}: ${this.formatCurrency(context.parsed)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                },
                elements: {
                    arc: {
                        borderRadius: 4
                    }
                }
            }
        };

        // Create or update chart
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, chartConfig);

        // Create custom legend
        this.createChartLegend(categoryTotals, totalSpent);
    }

    createChartLegend(categoryTotals, totalSpent) {
        const chartLegend = document.getElementById('chartLegend');
        
        chartLegend.innerHTML = categoryTotals.map(({ category, amount }) => {
            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            const color = this.categoryColors[category] || '#C9CBCF';
            
            return `
                <div class="legend-item fade-in">
                    <div class="legend-color" style="background-color: ${color}"></div>
                    <div class="legend-content">
                        <div class="legend-category">${this.getCategoryIcon(category)} ${category}</div>
                        <div class="legend-amount">${this.formatCurrency(amount)}</div>
                        <div class="legend-percentage">${percentage.toFixed(1)}% of total spending</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Utility Functions
    getCategoryIcon(category) {
        const icons = {
            'Food': '🍽️',
            'Transportation': '🚗',
            'Housing': '🏠',
            'Utilities': '⚡',
            'Entertainment': '🎬',
            'Healthcare': '🏥',
            'Shopping': '🛍️',
            'Other': '📝'
        };
        return icons[category] || '📝';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    // Budget Warnings
    checkBudgetWarnings() {
        const budgetUsed = this.getBudgetUsedPercentage();
        const remaining = this.getRemainingBudget();

        if (remaining < 0) {
            this.showToast('⚠️ Warning: You have exceeded your monthly budget!', 'error');
        } else if (budgetUsed >= 90) {
            this.showToast('⚠️ Warning: You are close to your budget limit!', 'warning');
        } else if (budgetUsed >= 75) {
            this.showToast('💡 Info: You have used 75% of your budget', 'warning');
        }
    }

    // Toast Notifications
    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // Modal Functions
    showModal(message, action) {
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').classList.add('show');
        this.pendingAction = action;
    }

    hideModal() {
        document.getElementById('confirmModal').classList.remove('show');
        this.pendingAction = null;
    }

    executeConfirmAction() {
        if (this.pendingAction) {
            this.pendingAction();
        }
        this.hideModal();
    }

    // Confirmation Functions
    confirmDeleteExpense(expenseId) {
        const expense = this.data.expenses.find(exp => exp.id === expenseId);
        if (expense) {
            this.showModal(
                `Are you sure you want to delete the ${expense.category} expense of ${this.formatCurrency(expense.amount)}?`,
                () => this.deleteExpense(expenseId)
            );
        }
    }

    confirmClearAll() {
        const currentExpenses = this.getCurrentMonthExpenses();
        if (currentExpenses.length === 0) {
            this.showToast('No expenses to clear', 'warning');
            return;
        }

        this.showModal(
            `Are you sure you want to delete all ${currentExpenses.length} expenses for this month?`,
            () => this.clearAllExpenses()
        );
    }

    clearAllExpenses() {
        const currentMonth = new Date().toISOString().substring(0, 7);
        this.data.expenses = this.data.expenses.filter(expense => 
            expense.date.substring(0, 7) !== currentMonth
        );
        this.saveData();
        this.updateDisplay();
        this.showToast('All expenses cleared', 'success');
    }

    // Cleanup method for chart
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    // Export/Import Functions (Bonus feature)
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `budget-data-${new Date().toISOString().substring(0, 10)}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully', 'success');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = { ...this.data, ...importedData };
                this.saveData();
                this.updateDisplay();
                this.showToast('Data imported successfully', 'success');
            } catch (error) {
                this.showToast('Error importing data: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetTracker = new BudgetTracker();
});

// Additional utility functions for enhanced functionality

// Get month name
function getMonthName(date = new Date()) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add expense when form is focused
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('expenseForm');
        if (document.activeElement && form.contains(document.activeElement)) {
            e.preventDefault();
            document.getElementById('expenseForm').dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('confirmModal');
        if (modal.classList.contains('show')) {
            window.budgetTracker.hideModal();
        }
    }
});

// Auto-focus on amount input when category is selected
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('expenseCategory');
    const amountInput = document.getElementById('expenseAmount');
    
    categorySelect.addEventListener('change', () => {
        if (categorySelect.value && !amountInput.value) {
            amountInput.focus();
        }
    });
});

// Add some helpful console methods for debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugBudget = {
        viewData: () => console.log(window.budgetTracker.data),
        clearData: () => {
            localStorage.removeItem('budgetTrackerData');
            location.reload();
        },
        addTestData: () => {
            const testExpenses = [
                { category: 'Food', amount: 45.50, description: 'Grocery shopping' },
                { category: 'Transportation', amount: 12.75, description: 'Bus fare' },
                { category: 'Entertainment', amount: 25.00, description: 'Movie tickets' },
                { category: 'Food', amount: 18.25, description: 'Lunch' }
            ];
            
            testExpenses.forEach(expense => {
                window.budgetTracker.data.expenses.unshift({
                    id: Date.now() + Math.random(),
                    ...expense,
                    date: new Date().toISOString()
                });
            });
            
            window.budgetTracker.saveData();
            window.budgetTracker.updateDisplay();
            console.log('Test data added!');
        }
    };
    
    console.log('Debug tools available: debugBudget.viewData(), debugBudget.clearData(), debugBudget.addTestData()');
}