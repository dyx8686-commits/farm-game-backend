console.log("CORE LOADED");

// ================= STATE =================
window.worldState = {
    player: {
        type: "FARMER"
    },
    inventory: {},
    hotbar: new Array(9).fill(null),
    selectedSlot: 0
};

// ================= START =================
window.addEventListener("load", () => {
    createWorld();
    render();
});

// ================= WORLD =================
function createWorld() {
    const container = document.getElementById("plots");

    const plots = [];

    for (let y = 3; y < 6; y++) {
        for (let x = 4; x < 7; x++) {
            plots.push({ x, y });
        }
    }

    plots.forEach(p => {
        const el = document.createElement("div");
        el.className = "plot";
        el.style.left = p.x * 60 + "px";
        el.style.top = p.y * 60 + "px";
        container.appendChild(el);
    });
}

// ================= RENDER =================
function render() {
    renderHotbar();
}

// ================= HOTBAR =================
function renderHotbar() {
    const bar = document.getElementById("hotbar");
    bar.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const slot = document.createElement("div");
        slot.className = "hotbar-slot";

        if (i === worldState.selectedSlot) {
            slot.style.border = "2px solid gold";
        }

        slot.innerText = worldState.hotbar[i] || "";

        slot.onclick = () => {
            worldState.selectedSlot = i;
            renderHotbar();
        };

        bar.appendChild(slot);
    }
}
