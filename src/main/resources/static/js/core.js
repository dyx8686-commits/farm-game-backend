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
    plotsReady: false,

    selectedItem: null,

    hotbar: new Array(9).fill(null),
    selectedHotbarSlot: 0
};

// ================= THEME =================

function applyIslandTheme(player) {

    const body = document.getElementById("gameBody");
    if (!body) return;

    body.classList.remove("farm", "wood", "mine");

    if (player.type === "FARMER") {
        body.classList.add("farm");
    }

    if (player.type === "WOODCUTTER") {
        body.classList.add("wood");
    }

    if (player.type === "MINER") {
        body.classList.add("mine");
    }
}

// ================= LOAD =================

async function load() {

    try {

        const res = await fetch(BASE + "/game/state?name=" + playerName);

        if (!res.ok) {
            console.error("LOAD FAILED");
            return;
        }

        const player = await res.json();

        // ================= WORLD STATE =================

        worldState.player = player;
        worldState.inventory = player.inventory || {};

        // ================= THEME =================

        applyIslandTheme(player);

        // ================= RENDER =================

        render();

    } catch (err) {

        console.error("LOAD ERROR:", err);
    }
}

// ================= MAIN RENDER =================

function render() {

    renderWorld();

    renderInventory(worldState.inventory);

    renderHotbar();

    updatePlayer();
}

// ================= PLAYER =================

function updatePlayer() {

    const p = document.getElementById("player");
    if (!p) return;

    p.style.left = "420px";
    p.style.top = "260px";
}

// ================= GRID =================


// ================= PLOTS =================

function createPlots(playerType) {

    const container = document.getElementById("plots");

    if (!container) return;

    container.innerHTML = "";

    window.plots = [];

    const positions = getPlotPositions(playerType);

    positions.forEach((pos, index) => {

        const cell = document.createElement("div");

        cell.className = "plot";

        cell.style.position = "absolute";

        cell.style.left = (pos.x * 60) + "px";
        cell.style.top = (pos.y * 60) + "px";

        container.appendChild(cell);

        window.plots.push({
            id: index,
            x: pos.x,
            y: pos.y
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

function renderWorld() {

    if (!worldState.player) return;

    console.log("RENDER WORLD");

    createPlots(worldState.player.type);

    renderPlants(worldState.player);
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

    container.appendChild(grid);

    items.forEach(item => {

        const card = document.createElement("div");

        card.style.background = "#444";
        card.style.padding = "14px";
        card.style.borderRadius = "14px";
        card.style.textAlign = "center";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div style="font-size:42px;">
                ${item.icon}
            </div>

            <div style="color:white; margin-top:10px;">
                ${item.name}
            </div>

            <div style="color:gold; margin-top:6px;">
                ${item.price} 💰
            </div>
        `;

        card.onclick = async () => {

            const gold = worldState.inventory?.GOLD ?? 0;

            if (gold < item.price) {
                alert("Not enough gold");
                return;
            }

            try {

                const res = await fetch(BASE + "/game/buy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
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

                await load();

                showShopTab(tab);

            } catch (err) {

                console.error("BUY ERROR:", err);
            }
        };

        grid.appendChild(card);
    });
}

// ================= SHOP OPEN/CLOSE =================

window.openShop = function () {

    const modal = document.getElementById("shopModal");

    if (!modal) return;

    modal.style.display = "block";

    showShopTab("buy");
};

window.closeShop = function () {

    const modal = document.getElementById("shopModal");

    if (!modal) return;

    modal.style.display = "none";
};

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

document.addEventListener("keydown", (e) => {

    const num = parseInt(e.key);

    if (num >= 1 && num <= 9) {

        worldState.selectedHotbarSlot = num - 1;

        renderHotbar();
    }
});

// ================= START =================

window.addEventListener("load", () => {

    createGrid();

    updatePlayer();

    load();

    setInterval(load, 3000);
});
