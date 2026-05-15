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

    document.getElementById("info").innerHTML = `
        <b>${player.name}</b><br>
        CLASS: ${player.type}<br><br>

        FOOD: ${inv.FOOD ?? 0}<br>
        WOOD: ${inv.WOOD ?? 0}<br>
        ORE: ${inv.ORE ?? 0}<br>
        GOLD: ${inv.GOLD ?? 0}<br>
        SEEDS: ${inv.SEEDS ?? 0}<br>
        SAPLING: ${inv.SAPLING ?? 0}<br>
    `;

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

    let positions = getPlotPositions(playerType);

    positions.forEach((pos, index) => {

        const plot = document.createElement("div");
        plot.className = "plot";

        plot.style.left = pos.x + "px";
        plot.style.top = pos.y + "px";

        plot.innerText = index + 1;

       function onPlotClick(index, type) {
    console.log("PLOT CLICK:", index, type);
}
        container.appendChild(plot);

        window.plots.push({
            id: index,
            type: playerType,
            x: pos.x,
            y: pos.y,
            state: null // растение/дерево/руда
        });
    });
}
function getPlotPositions(type) {

    // базовая схема (6 точек)
    if (type === "FARMER") {
        return [
            { x: 250, y: 180 },
            { x: 320, y: 180 },
            { x: 390, y: 180 },

            { x: 250, y: 250 },
            { x: 320, y: 250 },
            { x: 390, y: 250 }
        ];
    }

    if (type === "WOODCUTTER") {
        return [
            { x: 200, y: 160 },
            { x: 280, y: 160 },
            { x: 360, y: 160 },

            { x: 200, y: 240 },
            { x: 280, y: 240 },
            { x: 360, y: 240 }
        ];
    }

    if (type === "MINER") {
        return [
            { x: 260, y: 200 },
            { x: 330, y: 200 },
            { x: 400, y: 200 },

            { x: 260, y: 270 },
            { x: 330, y: 270 },
            { x: 400, y: 270 }
        ];
    }

    return [];
}


// ================= LOOP =================

window.addEventListener("load", () => {
    createGrid();
    load();
    setInterval(load, 3000);
});
