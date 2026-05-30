function renderSubscriptions() {
    const tbody = document.querySelector('#subTable tbody');
    tbody.innerHTML = '';
    
    let totalMonthlyCost = 0;

    currentUserData.subscriptions.forEach(s => {
        totalMonthlyCost += s.cost;
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td style="font-weight:500;">${s.name}</td>
            <td class="text-danger" style="font-weight:600;">${formatRupiah(s.cost)}</td>
            <td>Setiap tgl ${s.date}</td>
            <td>
                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="editSub('${s.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" style="padding: 0.25rem 0.5rem;" onclick="deleteSub('${s.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('kpiSubTotal').textContent = formatRupiah(totalMonthlyCost);

    if (currentUserData.subscriptions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada langganan</td></tr>`;
    }
}

function saveSub() {
    const id = document.getElementById('subId').value;
    const name = document.getElementById('subName').value;
    const cost = parseFloat(document.getElementById('subCost').value);
    const date = parseInt(document.getElementById('subDate').value);

    if (!name || isNaN(cost) || isNaN(date) || date < 1 || date > 31) {
        alert('Input tidak valid');
        return;
    }

    const s = { id: id || Date.now().toString(), name, cost, date };

    if (id) {
        const idx = currentUserData.subscriptions.findIndex(x => x.id === id);
        currentUserData.subscriptions[idx] = s;
    } else {
        currentUserData.subscriptions.push(s);
    }

    saveUserData();
    closeModal('subModal');
}

function deleteSub(id) {
    if (confirm('Yakin hapus langganan ini?')) {
        currentUserData.subscriptions = currentUserData.subscriptions.filter(x => x.id !== id);
        saveUserData();
    }
}

function editSub(id) {
    const x = currentUserData.subscriptions.find(i => i.id === id);
    if(x) {
        document.getElementById('subId').value = x.id;
        document.getElementById('subName').value = x.name;
        document.getElementById('subCost').value = x.cost;
        document.getElementById('subDate').value = x.date;
        openModal('subModal');
    }
}
