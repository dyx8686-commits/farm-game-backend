// ================= MINE STATE =================

let stoneState = Array.from({ length: 6 }, () => ({
    active: true,
    respawnTime: 0
}));

const STONE_RESPAWN_TIME = 15000; // 15 секунд

// ================= RENDER STONES =================

function renderStones() {

    const c = document.getElementById("minerStones");
    if (!c) return;

    c.innerHTML = "";

    const now = Date.now();

    for (let i = 0; i < 6; i++) {

        const state = stoneState[i];

        // ================= RESPAWN LOGIC =================
        if (!state.active && now >= state.respawnTime) {
            state.active = true;
        }

        if (!state.active) continue;

        const d = document.createElement("div");
        d.className = "stoneObj";

        d.style.left = (180 + (i % 3) * 90) + "px";
        d.style.top = (180 + Math.floor(i / 3) * 90) + "px";

        d.innerText = "⛏";

        d.onclick = async () => {

            await fetch(BASE + "/game/mine?name=" + playerName, {
                method: "POST"
            });

            // ================= DISABLE NODE =================
            stoneState[i].active = false;
            stoneState[i].respawnTime = Date.now() + STONE_RESPAWN_TIME;

            renderStones();
            load();
        };

        c.appendChild(d);
    }
}
