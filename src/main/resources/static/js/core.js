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
        CORN_SEED: 0,
        POTATO_SEED: 0,

        WHEAT: 0,
        CORN: 0,
        POTATO: 0,

        GOLD: 0
    },

    plants: [],

    selectedItem: null,
    selectedSeed: "WHEAT"
};

// ================= LOAD =================

async function load() {

    try {

        const res = await fetch(BASE + "/game/state?name=" + playerName);

        if (!res.ok) return;

        const data = await res.json();

        worldState.player = data;

        worldState.inventory = {
            ...worldState.inventory,
            ...(data.inventory || {})
        };

        render();

    } catch (err) {

        console.error("LOAD ERROR:", err);
    }
}

// ================= RENDER =================

function render() {

    renderInventory(worldState.inventory);

    renderShop();
}

// ================= INVENTORY =================

function renderInventory(inv) {

    const el = document.getElementById("inventory");
    if (!el) return;

    el.innerHTML = `
        <div>🌱 Wheat Seeds: ${inv.WHEAT_SEED || 0}</div>
        <div>🌽 Corn Seeds: ${inv.CORN_SEED || 0}</div>
        <div>🥔 Potato Seeds: ${inv.POTATO_SEED || 0}</div>

        <hr>

        <div>🌾 Wheat: ${inv.WHEAT || 0}</div>
        <div>🌽 Corn: ${inv.CORN || 0}</div>
        <div>🥔 Potato: ${inv.POTATO || 0}</div>

        <hr>

        <div>💰 Gold: ${inv.GOLD || 0}</div>

        <hr>

        <button onclick="selectItem('WHEAT_SEED')">
            Select Wheat Seed
        </button>

        <button onclick="selectItem('CORN_SEED')">
            Select Corn Seed
        </button>

        <button onclick="selectItem('POTATO_SEED')">
            Select Potato Seed
        </button>

        <div style="margin-top:10px;">
            Selected: ${worldState.selectedItem || "NONE"}
        </div>
    `;
}

// ================= SHOP =================

function renderShop() {

    const el = document.getElementById("shopInfo");
    if (!el) return;

    el.innerHTML = `
        🌱 Wheat Seeds: ${worldState.inventory.WHEAT_SEED}<br>
        🌽 Corn Seeds: ${worldState.inventory.CORN_SEED}<br>
        🥔 Potato Seeds: ${worldState.inventory.POTATO_SEED}<br><br>

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

        // ================= CREATE PLOT =================

        if (!plots.has(key)) {

            const plotEl = document.createElement("div");

            plotEl.className = "plot";

            plotEl.style.left = x + "px";
            plotEl.style.top = y + "px";

            island.appendChild(plotEl);

            plots.set(key, {
                plantEl: null,
                stage: -1,
                type: null
            });

            return;
        }

        const cell = plots.get(key);

        // ================= PLANT =================

        if (cell.stage === -1) {

            const seedType = worldState.selectedItem;

            if (!seedType) return;

            if (!seedType.includes("_SEED")) return;

            if (worldState.inventory[seedType] <= 0) {
                alert("No seeds");
                return;
            }

            worldState.inventory[seedType]--;

            const plantType = seedType.replace("_SEED", "");

            const plant = createPlantVisual(
                x,
                y,
                0,
                plantType
            );

            island.appendChild(plant);

            cell.plantEl = plant;
            cell.stage = 0;
            cell.type = plantType;

            startGrowth(key);

            renderInventory(worldState.inventory);

            renderShop();

            return;
        }

        // ================= HARVEST =================

        if (cell.stage === 2) {

            if (cell.plantEl) {
                cell.plantEl.remove();
            }

            const type = cell.type;

            if (type === "WHEAT") {
                worldState.inventory.WHEAT++;
            }

            if (type === "CORN") {
                worldState.inventory.CORN++;
            }

            if (type === "POTATO") {
                worldState.inventory.POTATO++;
            }

            cell.plantEl = null;
            cell.stage = -1;
            cell.type = null;

            renderInventory(worldState.inventory);

            renderShop();

            return;
        }
    });
}

// ================= GROWTH =================

function startGrowth(key) {

    const cell = plots.get(key);

    if (!cell) return;

    let growTime = 3000;

    if (cell.type === "CORN") {
        growTime = 2000;
    }

    if (cell.type === "POTATO") {
        growTime = 4000;
    }

    setTimeout(() => growStep(key), growTime);
}

function growStep(key) {

    const cell = plots.get(key);

    if (!cell || !cell.plantEl) return;

    cell.stage++;

    const x = parseInt(key.split(":")[0]);
    const y = parseInt(key.split(":")[1]);

    const newPlant = createPlantVisual(
        x,
        y,
        cell.stage,
        cell.type
    );

    cell.plantEl.remove();

    cell.plantEl = newPlant;

    island.appendChild(newPlant);

    if (cell.stage < 2) {

        let growTime = 3000;

        if (cell.type === "CORN") {
            growTime = 2000;
        }

        if (cell.type === "POTATO") {
            growTime = 4000;
        }

        setTimeout(() => growStep(key), growTime);
    }
}

// ================= PLANT VISUAL =================

function createPlantVisual(x, y, stage, type) {

    const el = document.createElement("div");

    el.style.position = "absolute";

    el.style.width = "28px";
    el.style.height = "28px";

    el.style.borderRadius = "50%";

    el.style.left = (x + 16) + "px";
    el.style.top = (y + 16) + "px";

    el.style.zIndex = "10";

    // ================= WHEAT =================

    if (type === "WHEAT") {

        if (stage === 0) el.style.background = "#2ecc71";
        if (stage === 1) el.style.background = "#27ae60";
        if (stage === 2) el.style.background = "#145a32";
    }

    // ================= CORN =================

    if (type === "CORN") {

        if (stage === 0) el.style.background = "#f1c40f";
        if (stage === 1) el.style.background = "#f39c12";
        if (stage === 2) el.style.background = "#d68910";
    }

    // ================= POTATO =================

    if (type === "POTATO") {

        if (stage === 0) el.style.background = "#a67c52";
        if (stage === 1) el.style.background = "#8e5a2b";
        if (stage === 2) el.style.background = "#6e3f1a";
    }

    return el;
}

// ================= SHOP BUTTONS =================

function initShop() {

    const sellBtn = document.getElementById("sellBtn");

    const buyBtn = document.getElementById("buySeedBtn");

    if (sellBtn) {

        sellBtn.addEventListener("click", () => {

            if (worldState.inventory.WHEAT <= 0) {
                alert("No wheat");
                return;
            }

            worldState.inventory.WHEAT--;

            worldState.inventory.GOLD += 5;

            renderInventory(worldState.inventory);

            renderShop();
        });
    }

    if (buyBtn) {

        buyBtn.addEventListener("click", () => {

            if (worldState.inventory.GOLD < 3) {
                alert("Not enough gold");
                return;
            }

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

    renderInventory(worldState.inventory);
}

// ================= START =================

window.addEventListener("load", () => {

    load();

    setInterval(load, 3000);

    initShop();
});
