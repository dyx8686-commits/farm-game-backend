const BASE = "https://farm-game-backend-production.up.railway.app";

let playerName = new URLSearchParams(window.location.search).get("name");

if (!playerName) {
    alert("Player name missing");
}

// ================= WORLD STATE =================

window.worldState = {
    player: null,
    inventory: {
        WHEAT_SEED: 0,
        WHEAT: 0,
        GOLD: 0
    },

    plants: [],

    selectedItem: null
};

// ================= LOAD =================

async function load() {
    try {
        const res = await fetch(BASE + "/game/state?name=" + playerName);

        if (!res.ok) return;

        const data = await res.json();

        worldState.player = data;
        worldState.inventory = data.inventory || worldState.inventory;

        render();

    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

// ================= RENDER =================

function render() {
    if (!worldState.player) return;

    renderInventory(worldState.inventory);
    renderShop();
}

// ================= INVENTORY =================

function renderInventory(inv) {

    const el = document.getElementById("inventory");
    if (!el) return;

    el.innerHTML = `
        🌱 Seeds: ${inv.WHEAT_SEED || 0}<br>
        🌾 Wheat: ${inv.WHEAT || 0}<br>
        💰 Gold: ${inv.GOLD || 0}
    `;
}

// ================= SHOP =================

function renderShop() {

    const el = document.getElementById("shopInfo");
    if (!el) return;

    el.innerHTML = `
        🌱 Seeds: ${worldState.inventory.WHEAT_SEED}<br>
        💰 Gold: ${worldState.inventory.GOLD}
    `;
}

// ================= CLICK SYSTEM =================

const island = document.getElementById("island");
const GRID_SIZE = 60;

const plots = new Map();

if (island) {

    island.addEventListener("click", (e) => {

        const rect = island.getBoundingClientRect();

        const x = Math.floor((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
        const y = Math.floor((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

        const key = x + ":" + y;

        if (!plots.has(key)) {

            const plotEl = document.createElement("div");
            plotEl.className = "plot";
            plotEl.style.left = x + "px";
            plotEl.style.top = y + "px";

            island.appendChild(plotEl);

            plots.set(key, {
                plantEl: null,
                stage: -1
            });

            return;
        }

        const cell = plots.get(key);

        // ================= PLANT =================
        if (cell.stage === -1) {

            if (worldState.selectedItem !== "WHEAT_SEED") return;
            if (worldState.inventory.WHEAT_SEED <= 0) return;

            worldState.inventory.WHEAT_SEED--;

            const plant = createPlantVisual(x, y, 0);

            island.appendChild(plant);

            cell.plantEl = plant;
            cell.stage = 0;

            startGrowth(key);

            renderInventory(worldState.inventory);
            renderShop();

            return;
        }

        // ================= HARVEST =================
        if (cell.stage === 2) {

            cell.plantEl.remove();

            cell.plantEl = null;
            cell.stage = -1;

            worldState.inventory.WHEAT++;

            renderInventory(worldState.inventory);
            renderShop();

            return;
        }
    });
}

// ================= GROWTH =================

function startGrowth(key) {
    setTimeout(() => growStep(key), 3000);
}

function growStep(key) {

    const cell = plots.get(key);
    if (!cell || !cell.plantEl) return;

    cell.stage++;

    const x = parseInt(key.split(":")[0]);
    const y = parseInt(key.split(":")[1]);

    const newPlant = createPlantVisual(x, y, cell.stage);

    cell.plantEl.remove();
    cell.plantEl = newPlant;

    island.appendChild(newPlant);

    if (cell.stage < 2) {
        setTimeout(() => growStep(key), 3000);
    }
}

// ================= PLANT VISUAL =================

function createPlantVisual(x, y, stage) {

    const el = document.createElement("div");

    el.style.position = "absolute";
    el.style.width = "28px";
    el.style.height = "28px";
    el.style.borderRadius = "50%";
    el.style.left = (x + 16) + "px";
    el.style.top = (y + 16) + "px";
    el.style.zIndex = "10";

    if (stage === 0) el.style.background = "#2ecc71";
    if (stage === 1) el.style.background = "#27ae60";
    if (stage === 2) el.style.background = "#145a32";

    return el;
}

// ================= SHOP BUTTONS =================

function initShop() {

    const sellBtn = document.getElementById("sellBtn");
    const buyBtn = document.getElementById("buySeedBtn");

    if (sellBtn) {
        sellBtn.addEventListener("click", () => {

            if (worldState.inventory.WHEAT <= 0) return;

            worldState.inventory.WHEAT--;
            worldState.inventory.GOLD += 5;

            renderInventory(worldState.inventory);
            renderShop();
        });
    }

    if (buyBtn) {
        buyBtn.addEventListener("click", () => {

            if (worldState.inventory.GOLD < 3) return;

            worldState.inventory.GOLD -= 3;
            worldState.inventory.WHEAT_SEED++;

            renderInventory(worldState.inventory);
            renderShop();
        });
    }
}

// ================= SELECT ITEM =================

function selectItem(name) {
    worldState.selectedItem =
        worldState.selectedItem === name ? null : name;
}

// ================= START =================

window.addEventListener("load", () => {

    load();
    setInterval(load, 3000);

    initShop();
});
