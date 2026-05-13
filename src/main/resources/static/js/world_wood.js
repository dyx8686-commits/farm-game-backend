// ================= WOOD STATE =================

let treeState = Array.from({ length: 6 }, () => ({
    stage: "EMPTY", // EMPTY | SAPLING | TREE
    timer: 0,
    growStarted: false
}));

// ================= RENDER TREES =================

function renderTrees() {

    const c = document.getElementById("woodTrees");
    if (!c) return;

    c.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        const state = treeState[i];

        const d = document.createElement("div");
        d.className = "treeObj";

        d.style.left = (180 + (i % 3) * 90) + "px";
        d.style.top = (140 + Math.floor(i / 3) * 100) + "px";

        // ================= EMPTY =================
        if (state.stage === "EMPTY") {

            d.style.background = "#5a3d1a";
            d.innerText = "+";

            d.onclick = () => plantTree(i);
        }

        // ================= SAPLING =================
        if (state.stage === "SAPLING") {

            d.style.background = "#8B4513";
            d.innerText = "🌱";

            if (!state.growStarted) {
                state.growStarted = true;

                setTimeout(() => {
                    treeState[i].stage = "TREE";
                    treeState[i].growStarted = false;
                    renderTrees();
                }, 10000);
            }
        }

        // ================= TREE =================
        if (state.stage === "TREE") {

            d.style.background = "#2e8b57";
            d.innerText = "🌳";

            d.onclick = async () => {

                await fetch(BASE + "/game/wood?name=" + playerName, {
                    method: "POST"
                });

                treeState[i] = {
                    stage: "EMPTY",
                    timer: 0,
                    growStarted: false
                };

                renderTrees();
                load();
            };
        }

        c.appendChild(d);
    }
}

// ================= ACTION =================

function plantTree(index) {

    if (selectedItem !== "SAPLING") {
        alert("Выбери саженец");
        return;
    }

    if (treeState[index].stage !== "EMPTY") {
        alert("Тут уже есть объект");
        return;
    }

    treeState[index] = {
        stage: "SAPLING",
        timer: Date.now(),
        growStarted: false
    };

    renderTrees();
    load();
}