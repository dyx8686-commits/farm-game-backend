console.log("WORLD FARM LOADED");

// ================= FARM STATE =================

let fieldState = Array.from({ length: 6 }, () => ({
    stage: "EMPTY", // EMPTY | SEED | GROWING | READY
    timer: 0,
    growStarted: false
}));

// ================= RENDER PLANTS =================

function renderPlants() {

    const c = document.getElementById("farmerPlants");
    if (!c) return;

    c.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        const state = fieldState[i];

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
        if (state.stage === "SEED") {

            d.style.background = "#A0522D";
            d.innerText = "🌱";

            if (!state.growStarted) {
                state.growStarted = true;

                const index = i;

                setTimeout(() => {
                    fieldState[index].stage = "GROWING";
                    fieldState[index].growStarted = false;
                    renderPlants();
                }, 5000);
            }
        }

        // ================= GROWING =================
        if (state.stage === "GROWING") {

            d.style.background = "#7CFC00";
            d.innerText = "🌿";

            const index = i;

            setTimeout(() => {
                fieldState[index].stage = "READY";
                renderPlants();
            }, 10000);
        }

        // ================= READY =================
        if (state.stage === "READY") {

            d.style.background = "#FFD700";
            d.innerText = "🌾";

            d.onclick = async () => {

                await fetch(BASE + "/game/harvest?name=" + playerName);

                fieldState[i] = {
                    stage: "EMPTY",
                    timer: 0,
                    growStarted: false
                };

                renderPlants();
                load();
            };
        }

        c.appendChild(d);
    }
}

// ================= ACTION =================

function plantSeed(index) {

    console.log("PLANT CLICK", index, window.selectedItem);

    if (!window.selectedItem) {
        alert("Выбери семена");
        return;
    }

    fetch(BASE + "/game/plant?name=" + playerName + "&item=" + window.selectedItem, {
        method: "POST"
    })
    .then(res => res.json())
    .then(player => {
        console.log("PLANT OK", player);

        // обновляем всё после посадки
        load();
        renderPlants();
    })
    .catch(err => {
        console.error("PLANT ERROR", err);
    });
}
