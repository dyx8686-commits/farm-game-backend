console.log("WORLD FARM LOADED");

// ================= FARM STATE =================



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
        load();          // ← это единственный источник правды
    })
    .catch(err => {
        console.error("PLANT ERROR", err);
    });
}
