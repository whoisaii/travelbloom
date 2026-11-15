const input = document.getElementById('conditionInput');
const resultsBox = document.getElementById('results');

function render(list) {
    resultsBox.innerHTML = '';
    if (!list.length) {
        resultsBox.innerHTML = '<p class="none">No results found. Try "beach", "temple" or "country".</p>';
        return;
    }
    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `<img src="${item.imageUrl}" alt="${item.name}">
            <div class="info"><h3>${item.name}</h3><p>${item.description}</p><button>Visit</button></div>`;
        resultsBox.appendChild(card);
    });
}

function searchCondition() {
    const q = input.value.trim().toLowerCase();
    if (!q) { resultsBox.innerHTML = ''; return; }
    fetch('travel_recommendation_api.json')
        .then(r => r.json())
        .then(data => {
            let out = [];
            if (q.startsWith('beach')) out = data.beaches;
            else if (q.startsWith('temple')) out = data.temples;
            else if (q.startsWith('countr')) data.countries.forEach(c => out.push(...c.cities));
            else {
                data.countries.forEach(c => {
                    if (c.name.toLowerCase().includes(q)) out.push(...c.cities);
                    c.cities.forEach(ci => { if (ci.name.toLowerCase().includes(q) && !out.includes(ci)) out.push(ci); });
                });
                [...data.beaches, ...data.temples].forEach(p => { if (p.name.toLowerCase().includes(q)) out.push(p); });
            }
            render(out);
        })
        .catch(err => { resultsBox.innerHTML = '<p class="none">Error loading data.</p>'; console.error(err); });
}

function clearResults() { input.value = ''; resultsBox.innerHTML = ''; }

document.getElementById('btnSearch').addEventListener('click', searchCondition);
document.getElementById('btnClear').addEventListener('click', clearResults);
input.addEventListener('keydown', e => { if (e.key === 'Enter') searchCondition(); });
