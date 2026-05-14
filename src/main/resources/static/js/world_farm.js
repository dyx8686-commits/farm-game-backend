console.log("WORLD FARM LOADED");

// ================= FARM STATE =================
let fields = Array.from({ length: 6 }, () => ({
    stage: "EMPTY"
}));


// ================= RENDER PLANTS =================

function renderPlants() {

    const c = document.getElementById("farmerPlants");
    if (!c) return;

    c.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        const state = fields[i] || { stage: "EMPTY" };

        const d = document.createElement("div");
        d.className = "field";

        d.style.left = (240 + (i % 3) * 70) + "px";
        d.style.top = (180 + Math.floor(i / 3) * 70) + "px";

        // ================= EMPTY =================
        if (state.stage === "EMPTY") {

            d.style.background = "#8B5A2B";
            d.innerText = "+";

            d.onclick = function () {
                console.log("FIELD CLICK", i);
                plantSeed(i);
            };
        }

        // ================= SEED =================
        
        // ================= GROWING =================
        

        // ================= READY =================
        if (state.stage === "READY") {

            d.style.background = "#FFD700";
            d.innerText = "🌾";

            d.onclick = async () => {

                await fetch(BASE + "/game/harvest?name=" + playerName);

                fields[i] = {
    stage: "EMPTY"
};
            
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
