let pieChartInstance = null;
let barChartInstance = null;
let lineChartInstance = null;

function renderDashboard() {
    if(!currentUserData) return;

    let totalIncome = 0;
    let totalExpense = 0;
    
    // Process transactions
    currentUserData.transactions.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        if (tx.type === 'expense') totalExpense += tx.amount;
    });

    const cashFlow = totalIncome - totalExpense;

    // Calculate Assets
    let totalAssets = cashFlow; // Cash is part of cashflow (simplified)
    
    // Add Savings to assets
    currentUserData.goals.forEach(g => { totalAssets += g.current; });
    
    // Add Investments to assets
    currentUserData.investments.forEach(i => { totalAssets += i.current; });

    // Calculate Liabilities
    let totalLiabilities = 0;
    currentUserData.debts.forEach(d => { totalLiabilities += d.remaining; });

    const netWorth = totalAssets - totalLiabilities;

    // Update UI KPIs
    document.getElementById('kpiNetWorth').textContent = formatRupiah(netWorth);
    document.getElementById('kpiIncome').textContent = formatRupiah(totalIncome);
    document.getElementById('kpiExpense').textContent = formatRupiah(totalExpense);
    document.getElementById('kpiCashFlow').textContent = formatRupiah(cashFlow);

    // Color code cash flow
    const cfElem = document.getElementById('kpiCashFlow');
    if (cashFlow >= 0) {
        cfElem.classList.add('text-success');
        cfElem.classList.remove('text-danger');
    } else {
        cfElem.classList.add('text-danger');
        cfElem.classList.remove('text-success');
    }

    calculateHealthScore(totalIncome, totalExpense, totalLiabilities, totalAssets);
    updateCharts(totalIncome, totalExpense);
}

function calculateHealthScore(income, expense, debt, assets) {
    let score = 0;
    
    // 1. Saving Rate (Income - Expense) / Income (Max 30 points)
    if (income > 0) {
        const savingRate = (income - expense) / income;
        if (savingRate > 0.2) score += 30;
        else if (savingRate > 0.1) score += 20;
        else if (savingRate > 0) score += 10;
    }

    // 2. Debt Ratio (Debt / Assets) (Max 30 points)
    if (assets > 0) {
        const debtRatio = debt / assets;
        if (debtRatio === 0) score += 30;
        else if (debtRatio < 0.3) score += 25;
        else if (debtRatio < 0.5) score += 15;
        else if (debtRatio < 0.8) score += 5;
    } else if (debt === 0) {
        score += 30;
    }

    // 3. Cash Flow (Max 20 points)
    if (income > expense) score += 20;
    else if (income === expense) score += 10;

    // 4. Emergency Fund estimation (Assets / Monthly Expense) (Max 20 points)
    if (expense > 0) {
        const monthsCoverage = assets / expense;
        if (monthsCoverage >= 6) score += 20;
        else if (monthsCoverage >= 3) score += 15;
        else if (monthsCoverage >= 1) score += 5;
    } else if (assets > 0) {
        score += 20; // No expense but have assets
    }

    // Ensure score is between 0-100
    score = Math.min(Math.max(score, 0), 100);

    const scoreElem = document.getElementById('healthScoreValue');
    scoreElem.textContent = Math.round(score);

    // Color logic
    const iconElem = document.querySelector('#healthScoreDisplay i');
    iconElem.className = 'fas fa-heartbeat';
    if (score >= 81) iconElem.classList.add('text-success'); // Sangat Baik
    else if (score >= 61) iconElem.classList.add('text-primary'); // Baik
    else if (score >= 41) iconElem.classList.add('text-warning'); // Cukup
    else iconElem.classList.add('text-danger'); // Buruk
}

function initCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f8fafc' : '#1e293b';

    Chart.defaults.color = textColor;
    Chart.defaults.font.family = 'Inter';

    const barCtx = document.getElementById('barChart').getContext('2d');
    barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Total (Rp)',
                data: [0, 0],
                backgroundColor: ['#10b981', '#ef4444'],
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChartInstance = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['No Data'],
            datasets: [{
                data: [1],
                backgroundColor: ['#e2e8f0']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Net Worth',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: '#4f46e5',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.1)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function updateCharts(income, expense) {
    if(!barChartInstance) return;

    // Update Bar Chart
    barChartInstance.data.datasets[0].data = [income, expense];
    barChartInstance.update();

    // Update Pie Chart (Expense by Category)
    const expensesByCategory = {};
    currentUserData.transactions.forEach(tx => {
        if (tx.type === 'expense') {
            expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
        }
    });

    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);

    if (categories.length > 0) {
        pieChartInstance.data.labels = categories;
        pieChartInstance.data.datasets[0].data = amounts;
        // Generate random colors or use predefined
        const colors = ['#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e', '#64748b'];
        pieChartInstance.data.datasets[0].backgroundColor = categories.map((_, i) => colors[i % colors.length]);
    } else {
        pieChartInstance.data.labels = ['No Data'];
        pieChartInstance.data.datasets[0].data = [1];
        pieChartInstance.data.datasets[0].backgroundColor = ['#e2e8f0'];
    }
    pieChartInstance.update();

    // Line chart mock (in a real app, this would use historical net worth data)
    // We will just show a flat line of current net worth for demonstration since we only have current state
    const netWorth = parseFloat(document.getElementById('kpiNetWorth').textContent.replace(/[^0-9,-]+/g,""));
    lineChartInstance.data.datasets[0].data = [netWorth*0.8, netWorth*0.85, netWorth*0.9, netWorth*0.95, netWorth, netWorth];
    lineChartInstance.update();
}

function updateChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f8fafc' : '#1e293b';
    Chart.defaults.color = textColor;
    if(barChartInstance) barChartInstance.update();
    if(pieChartInstance) pieChartInstance.update();
    if(lineChartInstance) lineChartInstance.update();
}
