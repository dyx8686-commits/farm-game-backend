const BASE = "https://farm-game-backend-production.up.railway.app";

let playerName = new URLSearchParams(window.location.search).get("name");

if (!playerName) {
    alert("Player name missing");
}

// ================= WORLD STATE =================

window.worldState = {
    player: null,
    inventory: {},
    plants: [],
    hotbar: new Array(9).fill(null),
    selectedHotbarSlot: 0,
    selectedItem: null
};

// ================= LOAD =================

async function load() {
    try {
        const res = await fetch(BASE + "/game/state?name=" + playerName);

        if (!res.ok) return;

        const data = await res.json();

        worldState.player = data;
        worldState.inventory = data.inventory || {};

        render();

    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

// ================= MAIN RENDER =================

function render() {
    if (!worldState.player) return;

    applyIslandTheme(worldState.player);

    renderWorld(worldState.player);

    renderInventory(worldState.inventory);

    renderHotbar();

    updatePlayer();
}

// ================= THEME =================

function applyIslandTheme(player) {

    const body = document.body;

    body.classList.remove("farm", "wood", "mine");

    if (player.type === "FARMER") body.classList.add("farm");
    if (player.type === "WOODCUTTER") body.classList.add("wood");
    if (player.type === "MINER") body.classList.add("mine");
}

// ================= PLAYER =================

function updatePlayer() {

    const p = document.getElementById("player");
    if (!p) return;

    p.style.left = "420px";
    p.style.top = "260px";
}

// ================= WORLD ROUTER =================

function renderWorld(player) {

    const container = document.getElementById("plots");
    if (!container) return;

    container.innerHTML = "";

    if (player.type === "FARMER") {
        renderFarm(container);
    }

    if (player.type === "WOODCUTTER") {
        renderWood(container);
    }

    if (player.type === "MINER") {
        renderMine(container);
    }
}

// ================= FARM =================

function renderFarm(container) {

    const plots = [
        { x: 4, y: 3 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 6, y: 4 }
    ];

    plots.forEach(p => {
        const el = document.createElement("div");
        el.className = "plot";
        el.style.left = p.x * 60 + "px";
        el.style.top = p.y * 60 + "px";
        container.appendChild(el);
    });
}

// ================= WOOD =================

function renderWood(container) {

    const trees = [
        { x: 3, y: 3 },
        { x: 7, y: 4 }
    ];

    trees.forEach(t => {
        const el = document.createElement("div");
        el.className = "plot";
        el.style.background = "#2e8b57";
        el.style.left = t.x * 60 + "px";
        el.style.top = t.y * 60 + "px";
        container.appendChild(el);
    });
}

// ================= MINE =================

function renderMine(container) {

    const stones = [
        { x: 4, y: 2 },
        { x: 6, y: 5 }
    ];

    stones.forEach(s => {
        const el = document.createElement("div");
        el.className = "plot";
        el.style.background = "#666";
        el.style.left = s.x * 60 + "px";
        el.style.top = s.y * 60 + "px";
        container.appendChild(el);
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

        slot.innerText = item || "";

        slot.onclick = () => {
            worldState.selectedHotbarSlot = i;
            renderHotbar();
        };

        bar.appendChild(slot);
    }
}

// ================= INVENTORY (stub, если у тебя уже есть UI — оставляем) =================

function renderInventory(inv) {
    // если inventory.js есть — он перезапишет это
    console.log("inventory render", inv);
}

// ================= START =================

window.addEventListener("load", () => {
    load();
    setInterval(load, 3000);
});
