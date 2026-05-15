const BASE = "https://farm-game-backend-eo4y.onrender.com";
let playerName = new URLSearchParams(window.location.search).get("name");

let selectedItem = null;
function applyIslandTheme(player) {

    const body = document.getElementById("gameBody");

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

    const res = await fetch(
    BASE + "/game/state?name=" + playerName
);

const player = await res.json();
    window.currentInventory = player.inventory;

if (!player) return;

    const inv = player.inventory || {};

console.log(inv);

    console.log(player);

    applyIslandTheme(player);
    if (!window.currentPlotType || window.currentPlotType !== player.type) {
    createPlots(player.type);
    window.currentPlotType = player.type;
}
renderInventory(inv);
renderWorld(player);
updatePlayer();
}

// ================= WORLD ROUTER =================

function renderWorld(player) {

    document.getElementById("farmerPlants").innerHTML = "";
    document.getElementById("woodTrees").innerHTML = "";
    document.getElementById("minerStones").innerHTML = "";

    if (player.type === "FARMER") renderPlants(player);
    if (player.type === "WOODCUTTER") renderTrees(player);
    if (player.type === "MINER") renderStones(player);
}

// ================= PLAYER =================

function updatePlayer() {
    const p = document.getElementById("player");
    p.style.left = "420px";
    p.style.top = "260px";
}
//====== Клетки ====///
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

    // пример визуального теста
    cell.style.background = "rgba(255, 255, 0, 0.3)";
}
window.plots = [];

function createPlots(playerType) {

    const container = document.getElementById("plots");
    container.innerHTML = "";

    window.plots = [];

    const positions = getPlotPositions(playerType);

    positions.forEach((pos, index) => {

        const cell = document.createElement("div");
        cell.className = "plot";

        const cellSizeX = document.querySelector(".grid-cell")?.offsetWidth || 0;
        const cellSizeY = document.querySelector(".grid-cell")?.offsetHeight || 0;

        cell.style.left = (pos.x * cellSizeX) + "px";
        cell.style.top = (pos.y * cellSizeY) + "px";

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
function showShopTab(tab) {

    const container = document.getElementById("shopContent");
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

        card.style.background = "#444";
        card.style.padding = "12px";
        card.style.borderRadius = "10px";
        card.style.textAlign = "center";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div style="font-size:30px">${item.icon}</div>
            <div>${item.name}</div>
            <div style="color:gold">${item.price} 💰</div>
        `;

        card.onclick = () => {
            console.log("BUY:", item.name);
        };

        grid.appendChild(card);
    });
}

// ================= LOOP =================

window.addEventListener("load", () => {
    createGrid();
    load();
    setInterval(load, 3000);
});
