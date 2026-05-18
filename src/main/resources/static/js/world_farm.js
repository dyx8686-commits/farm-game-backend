// ================= FARM STATE =================

// ================= GLOBALS =================
let BASE = "";
let playerName = "";


// ================= LOAD GAME DATA =================
async function load() {
    try {
        const res = await fetch(BASE + "/game/state?name=" + playerName);
        const data = await res.json();

        renderPlants(data);

        // ⚠️ КРИТИЧНО: пересоздаём грядки после каждого обновления состояния
        createPlots();

    } catch (err) {
        console.error("LOAD ERROR", err);
    }
}


// ================= RENDER PLANTS =================
function renderPlants(player) {

    const c = document.getElementById("farmerPlants");
    if (!c) return;

    c.innerHTML = "";

    const fields = player.fields || [];

    for (let i = 0; i < 6; i++) {

        const state = fields[i] || { stage: "EMPTY" };

        const d = document.createElement("div");
        d.className = "field";

        d.style.position = "absolute";

        d.style.left = (240 + (i % 3) * 70) + "px";
        d.style.top = (180 + Math.floor(i / 3) * 70) + "px";

        // EMPTY
        if (state.stage === "EMPTY") {
            d.innerText = "+";
            d.onclick = () => plantSeed(i);
        }

        // SEED / GROWING
        if (state.stage === "SEED" || state.stage === "GROWING") {
            d.innerText = "🌱";
        }

        // READY
        if (state.stage === "READY") {
            d.innerText = "🌾";
            d.onclick = async () => {
                await fetch(BASE + "/game/harvest?name=" + playerName);
                load();
            };
        }

        c.appendChild(d);
    }
}


// ================= CREATE PLOTS =================
function createPlots() {

    const container = document.getElementById("plots");

    if (!container) {
        console.warn("plots container not found");
        return;
    }

    container.innerHTML = "";

    const cols = 15;
    const rows = 10;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            const cell = document.createElement("div");
            cell.className = "plot";

            cell.style.left = (x * 60) + "px";
            cell.style.top = (y * 60) + "px";

            container.appendChild(cell);
        }
    }
}


// ================= ACTION =================
function plantSeed(index) {

    if (!window.selectedItem) {
        alert("Выбери семена");
        return;
    }

    fetch(BASE + "/game/plant?name=" + playerName + "&item=" + window.selectedItem, {
        method: "POST"
    })
    .then(() => {
        load(); // единственный источник правды
    })
    .catch(err => {
        console.error("PLANT ERROR", err);
    });
}
