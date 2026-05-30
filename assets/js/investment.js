function renderInvestments() {
    const tbody = document.querySelector('#investTable tbody');
    tbody.innerHTML = '';

    currentUserData.investments.forEach(inv => {
        const tr = document.createElement('tr');
        
        const profitLoss = inv.current - inv.capital;
        const returnPercent = (profitLoss / inv.capital) * 100;
        
        let plClass = 'text-muted';
        let plSign = '';
        if (profitLoss > 0) { plClass = 'text-success'; plSign = '+'; }
        else if (profitLoss < 0) { plClass = 'text-danger'; }

        tr.innerHTML = `
            <td style="font-weight:500;">${inv.name}</td>
            <td><span class="badge" style="background:var(--bg-body); border:1px solid var(--border-color);">${inv.category}</span></td>
            <td>${formatRupiah(inv.capital)}</td>
            <td style="font-weight:600;">${formatRupiah(inv.current)}</td>
            <td class="${plClass}">${plSign}${formatRupiah(Math.abs(profitLoss))} (${plSign}${returnPercent.toFixed(2)}%)</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="editInvest('${inv.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem;" onclick="deleteInvest('${inv.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (currentUserData.investments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada investasi</td></tr>`;
    }
}

function saveInvest() {
    const id = document.getElementById('investId').value;
    const name = document.getElementById('investName').value;
    const category = document.getElementById('investCategory').value;
    const capital = parseFloat(document.getElementById('investCapital').value);
    const current = parseFloat(document.getElementById('investCurrent').value);

    if (!name || isNaN(capital) || isNaN(current)) {
        alert('Input tidak valid');
        return;
    }

    const inv = { id: id || Date.now().toString(), name, category, capital, current };

    if (id) {
        const idx = currentUserData.investments.findIndex(x => x.id === id);
        currentUserData.investments[idx] = inv;
    } else {
        currentUserData.investments.push(inv);
    }

    saveUserData();
    closeModal('investModal');
}

function deleteInvest(id) {
    if (confirm('Yakin hapus investasi ini?')) {
        currentUserData.investments = currentUserData.investments.filter(x => x.id !== id);
        saveUserData();
    }
}

function editInvest(id) {
    const x = currentUserData.investments.find(i => i.id === id);
    if(x) {
        document.getElementById('investId').value = x.id;
        document.getElementById('investName').value = x.name;
        document.getElementById('investCategory').value = x.category;
        document.getElementById('investCapital').value = x.capital;
        document.getElementById('investCurrent').value = x.current;
        openModal('investModal');
    }
}
