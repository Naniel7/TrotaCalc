// =====================
// LOCAL STORAGE HELPERS
// =====================
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function load(key, def) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : def;
}

// =====================
// COLAPSABLES
// =====================
function toggleContainer(header) {
  const content = header.nextElementSibling;
  content.style.display =
    content.style.display === "none" ? "block" : "none";
}

// =====================
// MULTIPLICADORES
// =====================
const ataqueMult = { vanguardia: 1.5, neutro: 1, retaguardia: 0.5 };
const defensaMult = { vanguardia: 0.5, neutro: 1, retaguardia: 1.5 };

// =====================
// PERFILES
// =====================
const perfiles = {
  hermes: { nombre: "Hermes", debilidades: ["rayo"], resistencias: ["viento"] },
  beauty: { nombre: "Beauty Thief", debilidades: ["filo"], resistencias: ["rayo", "agua"] },
  fafnir: { nombre: "Fafnir", debilidades: ["rayo"], resistencias: ["psiquico"] },
  dominion: { nombre: "Dominion", debilidades: ["fuego", "oscuridad"], resistencias: ["rayo"] },
  omni: { nombre: "Omni", debilidades: ["agua", "luz"], resistencias: ["filo", "rayo"] },
  gevaudan: { nombre: "Gevaudan", debilidades: ["fuego", "psíquico"] }
};

let persona = load("persona", { debilidades: [], resistencias: [] });
let posicionElegida = load("posicion", "neutro");
let resultadoDefensa = load("resultadoDefensa", 0);
let elementoDanioDef = load("elementoDanioDef", null);

// =====================
// PERFIL
// =====================
function setpersona(key) {
  persona = perfiles[key];
  save("persona", persona);
  save("perfilKey", key);
  renderPerfil();
}

function renderPerfil() {
  document.getElementById("perfilActivo").textContent = persona.nombre || "Ninguno";
  document.getElementById("debilidadesPerfil").textContent = persona.debilidades.join(", ");
  document.getElementById("resistenciasPerfil").textContent = persona.resistencias.join(", ");
}

// =====================
// ATAQUE
// =====================
function tirarAtaque() {
  const dados = +document.getElementById("dados").value;
  const base = +document.getElementById("base").value || 0;
  posicionElegida = document.getElementById("posicion").value;

  let suma = 0, tiradas = [], diez = 0;
  for (let i = 0; i < dados; i++) {
    const d = Math.floor(Math.random() * 10) + 1;
    tiradas.push(d);
    suma += d;
    if (d === 10) diez++;
  }

  const data = {
    dados, base, posicionElegida,
    tiradas, suma,
    baseMasDados: suma + base,
    diez,
    mult: ataqueMult[posicionElegida],
    resultado: (suma + base) * ataqueMult[posicionElegida]
  };

  save("ataque", data);

  pintarAtaque(data);
}

function pintarAtaque(d) {
  document.getElementById("tiradasAtk").textContent = d.tiradas.join(", ");
  document.getElementById("totalAtk").textContent = d.suma;
  document.getElementById("baseAtk").textContent = d.base;
  document.getElementById("baseMasDadosAtk").textContent = d.baseMasDados;
  document.getElementById("diezAtk").textContent = d.diez;
  document.getElementById("multAtk").textContent = d.mult;
  document.getElementById("parcialAtk").textContent = d.resultado;

  document.getElementById("resultadoAtaque").style.display = "block";
  document.getElementById("posicionDef").value = d.posicionElegida;
}

// =====================
// DEFENSA
// =====================
function tirarDefensa() {
  const dados = +document.getElementById("dadosDef").value;
  const base = +document.getElementById("baseDef").value || 0;

  let suma = 0, tiradas = [], diez = 0;
  for (let i = 0; i < dados; i++) {
    const d = Math.floor(Math.random() * 10) + 1;
    tiradas.push(d);
    suma += d;
    if (d === 10) diez++;
  }

  const mult = defensaMult[posicionElegida];
  resultadoDefensa = (suma + base) * mult;

  const data = {
    dados, base,
    tiradas, suma,
    baseMasDados: suma + base,
    diez,
    mult,
    resultado: resultadoDefensa
  };

  save("defensa", data);
  save("resultadoDefensa", resultadoDefensa);

  pintarDefensa(data);
}

function pintarDefensa(d) {
  document.getElementById("tiradasDef").textContent = d.tiradas.join(", ");
  document.getElementById("totalDef").textContent = d.suma;
  document.getElementById("baseDefRes").textContent = d.base;
  document.getElementById("baseMasDadosDef").textContent = d.baseMasDados;
  document.getElementById("diezDef").textContent = d.diez;
  document.getElementById("multDef").textContent = d.mult;
  document.getElementById("parcialDef").textContent = d.resultado;

  document.getElementById("resultadoDefensaParcial").style.display = "block";
}

// =====================
// DAÑO
// =====================
function seleccionarElementoDef(e) {
  elementoDanioDef = e;
  save("elementoDanioDef", e);
  document.getElementById("elementoDefSeleccionado").textContent = e;
}

function calcularDanioDefensa() {
  const danio = +document.getElementById("danioEntrante").value || 0;
  save("danioEntrante", danio);

  let mult = 1;
  if (persona.debilidades.includes(elementoDanioDef)) mult = 1.25;
  if (persona.resistencias.includes(elementoDanioDef)) mult = 0.5;

  const final = danio > resultadoDefensa
    ? Math.round((danio - resultadoDefensa) * mult)
    : 0;

  save("danioFinal", { mult, final });

  document.getElementById("multElemDef").textContent = mult;
  document.getElementById("finalDef").textContent = final;
  document.getElementById("resultadoDefensaFinal").style.display = "block";
}

// =====================
// RESTORE ON LOAD
// =====================
window.onload = () => {
  document.getElementById("dados").value = load("ataque", {}).dados || 3;
  document.getElementById("base").value = load("ataque", {}).base || 0;
  document.getElementById("posicion").value = posicionElegida;
  document.getElementById("posicionDef").value = posicionElegida;

  document.getElementById("dadosDef").value = load("defensa", {}).dados || 2;
  document.getElementById("baseDef").value = load("defensa", {}).base || 0;
  document.getElementById("danioEntrante").value = load("danioEntrante", 0);

  const atk = load("ataque", null);
  if (atk) pintarAtaque(atk);

  const def = load("defensa", null);
  if (def) pintarDefensa(def);

  const perfilKey = load("perfilKey", null);
  if (perfilKey) setpersona(perfilKey);

  if (elementoDanioDef)
    document.getElementById("elementoDefSeleccionado").textContent = elementoDanioDef;

  const danioFinal = load("danioFinal", null);
  if (danioFinal) {
    document.getElementById("multElemDef").textContent = danioFinal.mult;
    document.getElementById("finalDef").textContent = danioFinal.final;
    document.getElementById("resultadoDefensaFinal").style.display = "block";
  }
};
