console.log("WORLD MINER LOADED");

// ================= RENDER STONES =================
function renderStones(player) {

    const c = document.getElementById("minerStones");
    if (!c) return;

    c.innerHTML = "";

    const fields = player.fields || [];

    for (let i = 0; i < 6; i++) {

        const state = fields[i] || { stage: "EMPTY" };

        const d = document.createElement("div");
        d.className = "stoneObj";

        d.style.left = (180 + (i % 3) * 90) + "px";
        d.style.top = (180 + Math.floor(i / 3) * 90) + "px";

        // EMPTY
        if (state.stage === "EMPTY") {
            d.innerText = "➕";
            d.onclick = () => plantOre(i);
        }

        // SEED / GROWING
        if (state.stage === "SEED" || state.stage === "GROWING") {
            d.innerText = "⛏";
        }

        // READY
        if (state.stage === "READY") {
            d.innerText = "💎";
            d.onclick = async () => {
                await fetch(BASE + "/game/harvest?name=" + playerName);
                load();
            };
        }

        c.appendChild(d);
    }
}

// ================= ACTION =================
function plantOre(index) {

    if (!window.selectedItem) {
        alert("Выбери руду");
        return;
    }

    fetch(BASE + "/game/plant?name=" + playerName + "&item=" + window.selectedItem, {
        method: "POST"
    })
    .then(() => {
        load();
    })
    .catch(err => {
        console.error("ORE PLANT ERROR", err);
    });
}
