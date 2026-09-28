let data = {persons: [], relationships: []};

const $ = id => document.getElementById(id);

async function init() {
  data = await fetch("data.json").then(r => r.json());
  fillSelect(data.persons);
  renderPerson(data.persons[0]?.id);
  renderAncestors(data.persons[0]?.id);
}

function fullName(p) {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

function fillSelect(persons, filter = "") {
  const q = filter.toLowerCase();
  const list = persons.filter(p => fullName(p).toLowerCase().includes(q));
  $("personSelect").innerHTML = list.map(p =>
    `<option value="${p.id}">${escapeHtml(fullName(p))}</option>`
  ).join("");
}

function getPerson(id) {
  return data.persons.find(p => p.id === id);
}

function parentsOf(id) {
  return data.relationships
    .filter(r => r.childId === id)
    .map(r => getPerson(r.parentId))
    .filter(Boolean);
}

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("de-DE").format(new Date(date + "T00:00:00"));
}

function renderPerson(id) {
  const p = getPerson(id);
  if (!p) return;
  const birth = [formatDate(p.birthDate), p.birthPlace].filter(Boolean).join(" · ");
  const death = [formatDate(p.deathDate), p.deathPlace].filter(Boolean).join(" · ");
  $("personCard").innerHTML = `
    <div class="person-name">${escapeHtml(fullName(p))}</div>
    ${birth ? `<div class="meta">Geboren: ${escapeHtml(birth)}</div>` : ""}
    ${death ? `<div class="meta">Gestorben: ${escapeHtml(death)}</div>` : ""}
    ${p.occupation ? `<div class="meta">Beruf: ${escapeHtml(p.occupation)}</div>` : ""}
  `;
}

function renderAncestors(startId) {
  const tree = $("tree");
  tree.innerHTML = "";
  if (!startId) return;

  let current = [getPerson(startId)];
  const seen = new Set();

  for (let generation = 1; generation <= 6 && current.length; generation++) {
    const parents = [];
    current.forEach(p => {
      if (!p) return;
      parentsOf(p.id).forEach(parent => {
        if (!seen.has(parent.id)) {
          seen.add(parent.id);
          parents.push(parent);
        }
      });
    });
    if (!parents.length) break;

    const label = document.createElement("div");
    label.className = "generation-label";
    label.textContent = `${generation}. Vorfahrengeneration`;
    tree.appendChild(label);

    const row = document.createElement("div");
    row.className = "generation";
    parents.forEach(p => {
      const div = document.createElement("div");
      div.className = "person";
      div.innerHTML = `
        <strong>${escapeHtml(fullName(p))}</strong>
        <span class="small">
          ${p.birthDate ? "geb. " + escapeHtml(formatDate(p.birthDate)) : ""}
          ${p.birthPlace ? " · " + escapeHtml(p.birthPlace) : ""}
        </span>`;
      div.onclick = () => {
        $("personSelect").value = p.id;
        renderPerson(p.id);
        renderAncestors(p.id);
      };
      row.appendChild(div);
    });
    tree.appendChild(row);
    current = parents;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

$("search").addEventListener("input", e => fillSelect(data.persons, e.target.value));
$("personSelect").addEventListener("change", e => {
  renderPerson(e.target.value);
  renderAncestors(e.target.value);
});
$("showAncestors").addEventListener("click", () => {
  renderAncestors($("personSelect").value);
});

init();
