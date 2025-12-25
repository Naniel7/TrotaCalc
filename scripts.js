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
    content.style.display === "block" ? "none" : "block";
}

// =====================
// MULTIPLICADORES
// =====================
const ataqueMult = { vanguardia: 1.5, neutro: 1, retaguardia: 0.5 };
const defensaMult = { vanguardia: 0.5, neutro: 1, retaguardia: 1.5 };

// =====================
// PERSONAS
// =====================
const perfiles = {
  hermes: {
    nombre: "Hermes",
    imagen: "assets/hermes.png",
    texto: [
      "Utiliza la magia de viento al máximo potencial.",
      "Posibilidad de Multi target en dados de viento.",
      "Se regenera un dado de 10 por turno."
    ],
    debilidades: ["rayo"],
    resistencias: ["viento"]
  },
  beauty: {
    nombre: "Beauty Thief",
    imagen: "assets/beauty.png",
    texto: [
      "Utiliza la magia de agua al máximo potencial.",
      "Puede curar x20 en equipo"
    ],
    debilidades: ["filo"],
    resistencias: ["rayo", "agua"]
  },
  fafnir: {
    nombre: "Fafnir",
    imagen: "assets/fafnir.png",
    texto: ["Utiliza la magia magnérica al máximo potencial."],
    debilidades: ["rayo"],
    resistencias: ["psiquico"]
  },
  dominion: {
    nombre: "Dominion",
    imagen: "assets/dominion.png",
    texto: ["Anula Luz", "Otorga Once More a toda la party por batalla al ofrecer dados físicos o mágicos según la afinidad de compañeros.",
     "Permite realizar curación x20 a la party usando dados de luz. ",
     "Puede restaurar toda la vida usando 3 dados de luz en quien sea.",,
     
     "Nivel II",

"Ahora puede curar a la party 1d50 por turno.",
"Nivel III",
"Puede sacrificar toda su vida quedando con 1 HP restaurado toda la vida de sus aliados y 10 dados de cansancio a la caja. Esto puede realizarse 1 vez por partida."
,
    

"Ahora puede transformar dados de oscuridad en luz.",

"Nivel IV",
"Puede usar la luz con su maxima magia.",
"Puede sanar 50 puntos por turno.",
"Si el jugador muere, cura 150 HP a todos"],
    debilidades: ["fuego", "oscuridad"],
    resistencias: ["rayo"]
  },
  omni: {
    nombre: "Omni",
    imagen: "img/omni.png",
    texto: [""],
    debilidades: ["agua", "luz"],
    resistencias: ["filo", "rayo"],

  },
  gevaudan: {
    nombre: "Gevaudan",
    imagen: "img/gevaudan.png",
    texto: ["Ataques brutales.", "Daño aumentado a enemigos debilitados."],
    debilidades: ["fuego", "psiquico"],
    resistencias: [],
  }
};

let persona = load("persona", {});
let posicionElegida = load("posicion", "neutro");

// =====================
// PERFIL
// =====================
function setpersona(key) {
  persona = perfiles[key];
  save("persona", persona);
  save("perfilKey", key);
  renderPerfil();
  renderCartaPersona();
}

function renderPerfil() {
  document.getElementById("perfilActivo").textContent = persona.nombre || "Ninguno";
  document.getElementById("debilidadesPerfil").textContent =
    persona.debilidades?.join(", ") || "";
  document.getElementById("resistenciasPerfil").textContent =
    persona.resistencias?.join(", ") || "";
}

// =====================
// CARTA
// =====================
function renderCartaPersona() {
  const zona = document.getElementById("personaCard");
  if (!persona?.nombre) {
    zona.innerHTML = "";
    return;
  }

  zona.innerHTML = `
    <div class="card holo">
      <div class="card-header">${persona.nombre}</div>
      <div class="card-image">
        <img src="${persona.imagen}">
      </div>
      <div class="card-text">
        ${persona.texto.map(t => `<p>${t}</p>`).join("")}
      </div>
      <div class="card-footer">
      

      </div>
    </div>
  `;

  activarHolografico();
}

// =====================
// HOLOGRÁFICO (FIX)
// =====================
function activarHolografico() {
  const card = document.querySelector(".card.holo");
  if (!card) return;

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rx = ((y / rect.height) - 0.5) * -25;
    const ry = ((x / rect.width) - 0.5) * 25;

    card.style.transform = `
      rotateX(${rx}deg)
      rotateY(${ry}deg)
      scale(1.05)
    `;

    card.style.setProperty("--glow-x", `${x}px`);
    card.style.setProperty("--glow-y", `${y}px`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
}
