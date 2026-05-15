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
function createGrid() {

    const grid = document.getElementById("grid");
    if (!grid) return;

    grid.innerHTML = "";

    const total = 15 * 10;

    for (let i = 0; i < total; i++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        grid.appendChild(cell);
    }
}

createGrid();


// ================= LOOP =================

setInterval(load, 3000);
load();
