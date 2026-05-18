const BASE = "https://farm-game-backend-production.up.railway.app";
let playerName = new URLSearchParams(window.location.search).get("name");
if (!playerName) {
    alert("Player name missing");
}

let selectedItem = null;

// ================= THEME =================

function applyIslandTheme(player) {
    const body = document.getElementById("gameBody");
    if (!body) return;

    body.classList.remove("farm", "wood", "mine");

    if (player.type === "FARMER") body.classList.add("farm");
    if (player.type === "WOODCUTTER") body.classList.add("wood");
    if (player.type === "MINER") body.classList.add("mine");
}

// ================= LOAD (ТОЛЬКО ДАННЫЕ) =================

async function load() {
    try {
        const res = await fetch(BASE + "/game/state?name=" + playerName);

        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        if (!text || text.trim() === "") return;

        let player;
        try {
            player = JSON.parse(text);
        } catch (e) {
            console.error("INVALID JSON:", text);
            return;
        }

        if (!player) return;

        window.currentInventory = player.inventory || {};

        applyIslandTheme(player);

        if (!window.plots || window.plots.length === 0) {
            window.currentPlotType = player.type;

            const container = document.getElementById("plots");
            if (container) container.innerHTML = "";

            createPlots(player.type);
        }

        if (typeof updateInventoryUI === "function") {
            updateInventoryUI(window.currentInventory);
        }

        if (typeof updateGoldUI === "function") {
            updateGoldUI(window.currentInventory.GOLD);
        }

        updatePlayer();

    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

// ================= PLAYER =================

function updatePlayer() {
    const p = document.getElementById("player");
    if (!p) return;

    p.style.left = "420px";
    p.style.top = "260px";
}

// ================= GRID =================

const GRID_WIDTH = 15;
const GRID_HEIGHT = 10;

window.gridData = [];

function createGrid() {
    const grid = document.getElementById("grid");
    if (!grid || grid.dataset.ready === "true") return;

    grid.innerHTML = "";
    window.gridData = [];

    grid.dataset.ready = "true";

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {

            const cell = document.createElement("div");
            cell.className = "grid-cell";

            cell.dataset.x = x;
            cell.dataset.y = y;

            cell.onclick = () => onCellClick(x, y, cell);

            grid.appendChild(cell);

            window.gridData.push({
                x,
                y,
                element: cell,
                occupied: false
            });
        }
    }
}

function onCellClick(x, y, cell) {
    console.log("CLICK CELL:", x, y);
    cell.style.background = "rgba(255, 255, 0, 0.3)";
}

// ================= PLOTS (CSS GRID) =================
function createPlots(playerType) {

    console.log("CREATE PLOTS CALLED", playerType);

    const container = document.getElementById("plots");
    if (!container) return;

    container.innerHTML = "";
    window.plots = [];

    const positions = getPlotPositions(playerType);

    positions.forEach((pos, index) => {
        const cell = document.createElement("div");
        cell.className = "plot";

        cell.style.gridColumnStart = pos.x + 1;
        cell.style.gridRowStart = pos.y + 1;

        cell.innerText = index + 1;

        container.appendChild(cell);

        window.plots.push({
            id: index,
            type: playerType,
            x: pos.x,
            y: pos.y,
            state: null
        });
    });
}
// ================= WORLD ROUTER =================

function renderWorld(player) {

    if (player.type === "FARMER") renderPlants(player);
    if (player.type === "WOODCUTTER") renderTrees(player);
    if (player.type === "MINER") renderStones(player);
}

// ================= SHOP =================
function showShopTab(tab) {

    const container = document.getElementById("shopContent");

    if (!container) {
        console.error("shopContent NOT FOUND");
        return;
    }

    container.innerHTML = "";

    let items = [];

    if (tab === "buy") {
        items = [
            { name: "WHEAT_SEEDS", icon: "🌾", price: 10 },
            { name: "CORN_SEEDS", icon: "🌽", price: 15 },
            { name: "POTATO_SEEDS", icon: "🥔", price: 12 }
        ];
    }

    if (tab === "sell") {
        items = [
            { name: "WHEAT", icon: "🌾", price: 5 },
            { name: "CORN", icon: "🌽", price: 8 },
            { name: "POTATO", icon: "🥔", price: 6 },
            { name: "WOOD", icon: "🪵", price: 12 },
            { name: "STONE", icon: "🪨", price: 15 }
        ];
    }

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.style.gap = "10px";
    grid.style.padding = "10px";
    grid.style.alignItems = "stretch";

    container.appendChild(grid);

    items.forEach(item => {

        const card = document.createElement("div");

        card.style.background = "linear-gradient(180deg, #4f4f4f, #2f2f2f)";
        card.style.padding = "14px";
        card.style.borderRadius = "14px";
        card.style.textAlign = "center";
        card.style.cursor = "pointer";

        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.justifyContent = "center";

        card.style.minHeight = "120px";
        card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
        card.style.border = "2px solid transparent";
        card.style.transition = "0.2s";

        card.innerHTML = `
            <div style="font-size:42px; margin-bottom:10px;">
                ${item.icon}
            </div>

            <div style="font-size:14px; font-weight:bold; margin-bottom:8px; color:white;">
                ${item.name}
            </div>

            <div style="color:gold; font-size:16px; font-weight:bold;">
                ${item.price} 💰
            </div>
        `;

        card.onclick = async () => {

            const gold = window.currentInventory?.GOLD ?? 0;

            if (gold < item.price) {
                alert("Not enough gold 💰");
                return;
            }

            try {
                const res = await fetch(BASE + "/game/buy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: playerName,
                        item: item.name,
                        price: item.price
                    })
                });

                if (!res.ok) {
                    alert("Buy failed");
                    return;
                }

                await refreshPlayerState();

                showShopTab(tab);
            } catch (err) {
                console.error("BUY ERROR:", err);
            }
        };

        grid.appendChild(card);
    });
}


// ================= START =================

window.addEventListener("load", () => {

    createGrid();

    updatePlayer();

    load();
    window.showShopTab = showShopTab;

    setInterval(load, 3000);
});


async function refreshPlayerState() {
    const res = await fetch(BASE + "/game/state?name=" + playerName);
    const player = await res.json();

    window.currentInventory = player.inventory || {};

    
}
function updateInventoryUI(inv) {
    window.currentInventory = inv;

    if (typeof renderInventory === "function") {
        renderInventory(inv);
    }
}

function updateGoldUI(amount) {

    const goldEl = document.getElementById("goldAmount");

    if (!goldEl) return;

    goldEl.innerText = amount ?? 0;
}
window.openShop = function () {
    console.log("OPEN SHOP MANUAL");

    const modal = document.getElementById("shopModal");

    modal.style.display = "block";

    showShopTab("buy");

    console.log("SHOP OPENED");
};

window.closeShop = function () {

    const modal = document.getElementById("shopModal");
    if (!modal) return;

    modal.style.display = "none";
};

document.addEventListener("click", (e) => {
    if (e.target.closest(".shop")) {
        console.log("SHOP CLICKED VIA DELEGATION");
        window.openShop();
    }
});

