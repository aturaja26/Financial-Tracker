const incomeCategories = ['Gaji', 'Freelance', 'Bonus', 'Dividen', 'Bisnis'];
const expenseCategories = ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Pendidikan', 'Kesehatan'];

function updateTxCategories() {
    const type = document.getElementById('txType').value;
    const catSelect = document.getElementById('txCategory');
    catSelect.innerHTML = '';
    
    const cats = type === 'income' ? incomeCategories : expenseCategories;
    cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
    });
}

function renderTransactions() {
    const tbody = document.querySelector('#txTable tbody');
    tbody.innerHTML = '';

    // Sort descending by date
    const txs = [...currentUserData.transactions].sort((a,b) => new Date(b.date) - new Date(a.date));

    txs.forEach(tx => {
        const tr = document.createElement('tr');
        const badgeClass = tx.type === 'income' ? 'badge-income' : 'badge-expense';
        const typeText = tx.type === 'income' ? 'Income' : 'Expense';
        const sign = tx.type === 'income' ? '+' : '-';
        const amountClass = tx.type === 'income' ? 'text-success' : 'text-danger';

        tr.innerHTML = `
            <td>${new Date(tx.date).toLocaleDateString('id-ID')}</td>
            <td>${tx.desc}</td>
            <td>${tx.category}</td>
            <td><span class="badge ${badgeClass}">${typeText}</span></td>
            <td class="${amountClass}">${sign} ${formatRupiah(tx.amount)}</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="editTx('${tx.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem;" onclick="deleteTx('${tx.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (txs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada transaksi</td></tr>`;
    }
}

function saveTransaction() {
    const id = document.getElementById('txId').value;
    const date = document.getElementById('txDate').value;
    const type = document.getElementById('txType').value;
    const category = document.getElementById('txCategory').value;
    const desc = document.getElementById('txDesc').value;
    const amount = parseFloat(document.getElementById('txAmount').value);

    if (!date || !desc || isNaN(amount)) {
        alert('Mohon isi form dengan benar!');
        return;
    }

    const tx = {
        id: id || Date.now().toString(),
        date, type, category, desc, amount
    };

    if (id) {
        const idx = currentUserData.transactions.findIndex(t => t.id === id);
        currentUserData.transactions[idx] = tx;
    } else {
        currentUserData.transactions.push(tx);
    }

    saveUserData();
    closeModal('txModal');
}

function deleteTx(id) {
    if (confirm('Yakin hapus transaksi ini?')) {
        currentUserData.transactions = currentUserData.transactions.filter(t => t.id !== id);
        saveUserData();
    }
}

function editTx(id) {
    const tx = currentUserData.transactions.find(t => t.id === id);
    if(tx) {
        document.getElementById('txId').value = tx.id;
        document.getElementById('txDate').value = tx.date;
        document.getElementById('txType').value = tx.type;
        updateTxCategories();
        document.getElementById('txCategory').value = tx.category;
        document.getElementById('txDesc').value = tx.desc;
        document.getElementById('txAmount').value = tx.amount;
        openModal('txModal');
    }
}
