const BASE = "https://farm-game-backend-eo4y.onrender.com";
let playerName = new URLSearchParams(window.location.search).get("name");

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
    const res = await fetch(BASE + "/game/state?name=" + playerName);
    const player = await res.json();

    if (!player) return;

    window.currentInventory = player.inventory || {};

    applyIslandTheme(player);

    // мир создаём только при смене типа
    if (window.currentPlotType !== player.type) {
        window.currentPlotType = player.type;

        const container = document.getElementById("plots");
        if (container) container.innerHTML = "";

        createPlots(player.type);
    }

    updateInventoryUI(window.currentInventory);
    updateGoldUI(window.currentInventory.GOLD);
    
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

window.plots = [];

function createPlots(playerType) {
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

function getPlotPositions(type) {
    return [
        { x: 4, y: 3 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 6, y: 4 }
    ];
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
    if (!container) return;

    container.innerHTML = "";

    const items = [
        { name: "WHEAT_SEEDS", icon: "🌾", price: 10 },
        { name: "CORN_SEEDS", icon: "🌽", price: 15 },
        { name: "POTATO_SEEDS", icon: "🥔", price: 12 },
        { name: "OAK_SAPLING", icon: "🌳", price: 20 },
        { name: "PINE_SAPLING", icon: "🌲", price: 25 }
    ];

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.style.gap = "10px";

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
};

        card.innerHTML = `
            <div style="font-size:30px">${item.icon}</div>
            <div>${item.name}</div>
            <div style="color:gold">${item.price} 💰</div>
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
    const modal = document.getElementById("shopModal");
    if (!modal) {
        console.error("shopModal not found in HTML");
        return;
    }

    modal.style.display = "block";

    if (typeof showShopTab === "function") {
        showShopTab("buy");
    }
};
document.querySelector(".shop")?.addEventListener("click", () => {
    console.log("SHOP DIV CLICKED");
});
document.addEventListener("click", (e) => {
    if (e.target.closest(".shop")) {
        console.log("SHOP CLICKED VIA DELEGATION");
        window.openShop();
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const shopBtn = document.querySelector(".shop");

    if (!shopBtn) {
        console.error("SHOP BUTTON NOT FOUND");
        return;
    }

    shopBtn.addEventListener("click", () => {
        console.log("SHOP CLICKED (EVENT)");
        window.openShop();
    });
});
