function renderGoals() {
    const container = document.getElementById('goalContainer');
    container.innerHTML = '';

    currentUserData.goals.forEach(g => {
        const percent = Math.min((g.current / g.target) * 100, 100);
        
        const div = document.createElement('div');
        div.className = 'kpi-card flex-col';
        div.style.alignItems = 'stretch';
        
        div.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <div class="kpi-icon blue"><i class="fas fa-bullseye"></i></div>
                <div class="flex gap-2">
                    <button class="btn btn-outline" style="padding: 0.25rem; font-size: 0.75rem;" onclick="editGoal('${g.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger" style="padding: 0.25rem; font-size: 0.75rem;" onclick="deleteGoal('${g.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <h3 style="font-weight:600; margin-bottom: 0.5rem;">${g.name}</h3>
            <p class="text-muted mb-4" style="font-size:0.875rem;">${formatRupiah(g.current)} / ${formatRupiah(g.target)}</p>
            <div class="progress-container">
                <div class="progress-bar success" style="width: ${percent}%"></div>
            </div>
            <p class="text-muted mt-2" style="font-size:0.75rem; text-align:right;">${percent.toFixed(1)}%</p>
        `;
        container.appendChild(div);
    });

    if (currentUserData.goals.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center;" class="text-muted">Belum ada tujuan tabungan</div>`;
    }
}

function saveGoal() {
    const id = document.getElementById('goalId').value;
    const name = document.getElementById('goalName').value;
    const target = parseFloat(document.getElementById('goalTarget').value);
    const current = parseFloat(document.getElementById('goalCurrent').value);

    if (!name || isNaN(target) || isNaN(current)) {
        alert('Input tidak valid');
        return;
    }

    const goal = { id: id || Date.now().toString(), name, target, current };

    if (id) {
        const idx = currentUserData.goals.findIndex(g => g.id === id);
        currentUserData.goals[idx] = goal;
    } else {
        currentUserData.goals.push(goal);
    }

    saveUserData();
    closeModal('goalModal');
}

function deleteGoal(id) {
    if (confirm('Yakin hapus tujuan ini?')) {
        currentUserData.goals = currentUserData.goals.filter(g => g.id !== id);
        saveUserData();
    }
}

function editGoal(id) {
    const g = currentUserData.goals.find(x => x.id === id);
    if(g) {
        document.getElementById('goalId').value = g.id;
        document.getElementById('goalName').value = g.name;
        document.getElementById('goalTarget').value = g.target;
        document.getElementById('goalCurrent').value = g.current;
        openModal('goalModal');
    }
}
