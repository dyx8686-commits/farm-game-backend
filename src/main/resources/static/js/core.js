const BASE = "https://farm-game-backend-production.up.railway.app";

let playerName = new URLSearchParams(window.location.search).get("name");

if (!playerName) {
    alert("Player name missing");
}

// ================= WORLD STATE =================

window.worldState = {
    player: null,
    inventory: {},

    hotbar: new Array(9).fill(null),
    selectedHotbarSlot: 0,

    selectedItem: null
};

// ================= THEME =================

function applyIslandTheme(player) {

    const body = document.getElementById("gameBody");
    if (!body) return;

    body.classList.remove("farm", "wood", "mine");

    if (player.type === "FARMER") body.classList.add("farm");
    if (player.type === "WOODCUTTER") body.classList.add("wood");
    if (player.type === "MINER") body.classList.add("mine");
}

// ================= LOAD =================

async function load() {

    try {

        const res = await fetch(BASE + "/game/state?name=" + playerName);
        if (!res.ok) return;

        const player = await res.json();

        worldState.player = player;
        worldState.inventory = player.inventory || {};

        applyIslandTheme(player);

        renderWorld();
        renderInventory(worldState.inventory);
        renderHotbar();
        updatePlayer();

    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

// ================= RENDER =================

function renderWorld() {

    if (!worldState.player) return;

    createPlots(worldState.player.type);
    renderPlants(worldState.player);
}

// ================= PLAYER =================

function updatePlayer() {

    const p = document.getElementById("player");
    if (!p) return;

    p.style.left = "420px";
    p.style.top = "260px";
}

// ================= PLOTS =================

function createPlots(playerType) {

    console.log("CREATE PLOTS CALLED");

    const container = document.getElementById("plots");

    if (!container) {
        console.error("NO #plots FOUND");
        return;
    }

    container.innerHTML = "";

    window.plots = [];

    const positions = [
        { x: 4, y: 3 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 6, y: 4 }
    ];

    positions.forEach((pos, index) => {

        const cell = document.createElement("div");

        cell.className = "plot";

        cell.style.position = "absolute";
        cell.style.left = (pos.x * 60) + "px";
        cell.style.top = (pos.y * 60) + "px";

        cell.style.width = "60px";
        cell.style.height = "60px";

        cell.style.background = "rgba(139, 69, 19, 0.9)";
        cell.style.border = "2px solid black";

        container.appendChild(cell);

        window.plots.push(pos);
    });
}

// ================= PLANTS =================

function renderPlants(player) {

    const container = document.getElementById("plants");
    if (!container) return;

    container.innerHTML = "";

    window.plots.forEach(plot => {

        const plant = document.createElement("div");

        plant.style.position = "absolute";
        plant.style.left = (plot.x * 60 + 12) + "px";
        plant.style.top = (plot.y * 60 + 12) + "px";

        plant.style.fontSize = "26px";
        plant.innerText = "🌱";

        container.appendChild(plant);
    });
}

// ================= HOTBAR =================

function renderHotbar() {

    const bar = document.getElementById("hotbar");
    if (!bar) return;

    bar.innerHTML = "";

    for (let i = 0; i < 9; i++) {

        const slot = document.createElement("div");
        slot.className = "hotbar-slot";

        const item = worldState.hotbar[i];

        if (i === worldState.selectedHotbarSlot) {
            slot.classList.add("active");
        }

        slot.innerText = item ? item : "";

        slot.onclick = () => {
            worldState.selectedHotbarSlot = i;
            renderHotbar();
        };

        bar.appendChild(slot);
    }
}

// ================= START =================

window.addEventListener("load", () => {

    console.log("CORE STARTED");

    updatePlayer();

    load();

    setInterval(load, 3000);
});
