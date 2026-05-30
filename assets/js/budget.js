function renderBudgets() {
    const container = document.getElementById('budgetContainer');
    container.innerHTML = '';

    // Calculate spent per category this month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const spentByCategory = {};
    currentUserData.transactions.forEach(tx => {
        const txDate = new Date(tx.date);
        if (tx.type === 'expense' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
            spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + tx.amount;
        }
    });

    currentUserData.budgets.forEach(b => {
        const spent = spentByCategory[b.category] || 0;
        const remaining = b.limit - spent;
        const percent = Math.min((spent / b.limit) * 100, 100);
        
        let colorClass = 'success';
        if (percent > 90) colorClass = 'danger';
        else if (percent > 75) colorClass = 'warning';

        const div = document.createElement('div');
        div.style.padding = '1.5rem';
        div.style.borderBottom = '1px solid var(--border-color)';
        
        div.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 style="font-weight:600;">${b.category}</h3>
                    <p class="text-muted" style="font-size:0.875rem;">Sisa: ${formatRupiah(remaining)}</p>
                </div>
                <div style="text-align:right;">
                    <p style="font-weight:600;">${formatRupiah(spent)} / ${formatRupiah(b.limit)}</p>
                    <p class="text-muted" style="font-size:0.875rem;">${percent.toFixed(1)}% terpakai</p>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar ${colorClass}" style="width: ${percent}%"></div>
            </div>
            <div class="mt-4 flex gap-2">
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="editBudget('${b.id}')">Edit</button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" onclick="deleteBudget('${b.id}')">Hapus</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (currentUserData.budgets.length === 0) {
        container.innerHTML = `<div style="padding: 1.5rem; text-align:center;">Belum ada budget yang diatur</div>`;
    }
}

function saveBudget() {
    const id = document.getElementById('budgetId').value;
    const category = document.getElementById('budgetCategory').value;
    const limit = parseFloat(document.getElementById('budgetLimit').value);

    if (isNaN(limit) || limit <= 0) {
        alert('Nominal tidak valid');
        return;
    }

    const budget = {
        id: id || Date.now().toString(),
        category, limit
    };

    if (id) {
        const idx = currentUserData.budgets.findIndex(b => b.id === id);
        currentUserData.budgets[idx] = budget;
    } else {
        // Prevent duplicate category budget
        if(currentUserData.budgets.find(b => b.category === category)) {
            alert('Budget untuk kategori ini sudah ada. Silakan edit yang ada.');
            return;
        }
        currentUserData.budgets.push(budget);
    }

    saveUserData();
    closeModal('budgetModal');
}

function deleteBudget(id) {
    if (confirm('Yakin hapus budget ini?')) {
        currentUserData.budgets = currentUserData.budgets.filter(b => b.id !== id);
        saveUserData();
    }
}

function editBudget(id) {
    const b = currentUserData.budgets.find(x => x.id === id);
    if(b) {
        document.getElementById('budgetId').value = b.id;
        document.getElementById('budgetCategory').value = b.category;
        document.getElementById('budgetLimit').value = b.limit;
        openModal('budgetModal');
    }
}
