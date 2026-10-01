const SAMPLE = [
  { name: 'Across', initials: 'AC', clicks: 6, prompts: 2, approvals: 1, switches: 1, fee: 1.84, latency: 2.4 },
  { name: 'Stargate', initials: 'SG', clicks: 7, prompts: 2, approvals: 1, switches: 1, fee: 2.16, latency: 3.1 },
  { name: 'Jumper', initials: 'JU', clicks: 8, prompts: 3, approvals: 1, switches: 2, fee: 2.03, latency: 2.7 }
];
const storageKey = 'bridge-friction-observations-v1';
let routes = JSON.parse(localStorage.getItem(storageKey) || 'null') || structuredClone(SAMPLE);
const $ = (selector) => document.querySelector(selector);
const friction = (r) => Math.round(r.clicks + r.prompts * 2 + r.approvals * 3 + r.switches * 2 + r.latency / 5);
const plural = (value, word) => `${value} ${word === 'switch' && value !== 1 ? 'switches' : `${word}${value === 1 ? '' : 's'}`}`;

function render() {
  const mode = $('#sort-select').value;
  const sorted = [...routes].sort((a, b) => ({ friction: friction(a) - friction(b), clicks: a.clicks - b.clicks, fees: a.fee - b.fee, latency: a.latency - b.latency }[mode]));
  const maxScore = Math.max(...routes.map(friction));
  $('#route-list').innerHTML = sorted.map((r, index) => `
    <article class="route">
      <div class="route-brand"><span class="route-badge">${r.initials}</span><div>${r.name}<span class="rank">#${index + 1} by ${mode === 'friction' ? 'friction' : mode === 'fees' ? 'fee' : mode}</span></div></div>
      <div class="score"><strong class="score-number">${friction(r)}</strong><span class="meter"><i style="width:${Math.max(10, friction(r) / maxScore * 100)}%"></i></span></div>
      <div class="actions"><span class="chip">${plural(r.clicks, 'click')}</span><span class="chip">${plural(r.prompts, 'prompt')}</span><span class="chip ${r.approvals ? 'warning' : ''}">${plural(r.approvals, 'approval')}</span><span class="chip">${plural(r.switches, 'switch')}</span></div>
      <div class="cost">$${r.fee.toFixed(2)} <span>quoted fee</span><br>${r.latency.toFixed(1)} min <span>arrival</span></div>
    </article>`).join('');
  const byFriction = [...routes].sort((a,b) => friction(a)-friction(b));
  const median = [...routes].map(r => r.clicks + r.prompts).sort((a,b)=>a-b)[1];
  $('#best-route').textContent = `${byFriction[0].name} has the lowest friction in this sample.`;
  $('#insight-copy').textContent = `Its score is ${friction(byFriction[0])}; that reflects interaction cost alongside quote and arrival time—not a recommendation.`;
  $('#median-burden').textContent = median;
  $('#approval-tax').textContent = `${routes.filter(r => r.approvals > 0).length} / ${routes.length}`;
}
function buildForm() {
  $('#edit-form').innerHTML = routes.map((r, i) => `<div class="edit-row"><span class="route-name">${r.name}</span>${[['clicks','clicks'],['prompts','prompts'],['approvals','approvals'],['switches','switches'],['fee','fee $'],['latency','min']].map(([key,label]) => `<label>${label}<input required min="0" step="${key === 'fee' || key === 'latency' ? '.1' : '1'}" type="number" name="${i}-${key}" value="${r[key]}"></label>`).join('')}</div>`).join('');
}
$('#sort-select').addEventListener('change', render);
$('#method-button').addEventListener('click', () => $('#method-dialog').showModal());
$('#edit-button').addEventListener('click', () => { buildForm(); $('#edit-dialog').showModal(); });
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.close}`).close()));
$('#edit-form').addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); routes = routes.map((route, i) => Object.fromEntries(Object.entries(route).map(([key, value]) => [key, data.has(`${i}-${key}`) ? Number(data.get(`${i}-${key}`)) : value]))); localStorage.setItem(storageKey, JSON.stringify(routes)); $('#edit-dialog').close(); render(); });
$('#reset-button').addEventListener('click', () => { routes = structuredClone(SAMPLE); localStorage.removeItem(storageKey); buildForm(); render(); });
render();
