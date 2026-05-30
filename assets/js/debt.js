function renderDebts() {
    const tbody = document.querySelector('#debtTable tbody');
    tbody.innerHTML = '';

    currentUserData.debts.forEach(d => {
        const tr = document.createElement('tr');
        const paid = d.total - d.remaining;
        const percent = Math.min((paid / d.total) * 100, 100);
        
        tr.innerHTML = `
            <td style="font-weight:500;">${d.name}</td>
            <td>${formatRupiah(d.total)}</td>
            <td class="text-danger" style="font-weight:600;">${formatRupiah(d.remaining)}</td>
            <td>${formatRupiah(d.monthly)}</td>
            <td style="min-width: 150px;">
                <div class="progress-container">
                    <div class="progress-bar success" style="width: ${percent}%"></div>
                </div>
                <div style="font-size:0.75rem; text-align:right; margin-top:2px;" class="text-muted">${percent.toFixed(1)}% Lunas</div>
            </td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="editDebt('${d.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem;" onclick="deleteDebt('${d.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (currentUserData.debts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data utang</td></tr>`;
    }
}

function saveDebt() {
    const id = document.getElementById('debtId').value;
    const name = document.getElementById('debtName').value;
    const total = parseFloat(document.getElementById('debtTotal').value);
    const remaining = parseFloat(document.getElementById('debtRemaining').value);
    const monthly = parseFloat(document.getElementById('debtMonthly').value);

    if (!name || isNaN(total) || isNaN(remaining) || isNaN(monthly)) {
        alert('Input tidak valid');
        return;
    }

    const d = { id: id || Date.now().toString(), name, total, remaining, monthly };

    if (id) {
        const idx = currentUserData.debts.findIndex(x => x.id === id);
        currentUserData.debts[idx] = d;
    } else {
        currentUserData.debts.push(d);
    }

    saveUserData();
    closeModal('debtModal');
}

function deleteDebt(id) {
    if (confirm('Yakin hapus utang ini?')) {
        currentUserData.debts = currentUserData.debts.filter(x => x.id !== id);
        saveUserData();
    }
}

function editDebt(id) {
    const x = currentUserData.debts.find(i => i.id === id);
    if(x) {
        document.getElementById('debtId').value = x.id;
        document.getElementById('debtName').value = x.name;
        document.getElementById('debtTotal').value = x.total;
        document.getElementById('debtRemaining').value = x.remaining;
        document.getElementById('debtMonthly').value = x.monthly;
        openModal('debtModal');
    }
}
