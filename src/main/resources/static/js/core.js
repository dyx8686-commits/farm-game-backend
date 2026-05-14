const BASE = "https://farm-game-backend-eo4y.onrender.com";
let playerName = new URLSearchParams(window.location.search).get("name");

let selectedItem = null;

// ================= LOAD =================

async function load() {

    const res = await fetch(
    BASE + "/game/state?name=" + playerName
);

const player = await res.json();

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

// ================= LOOP =================

setInterval(load, 3000);
load();
