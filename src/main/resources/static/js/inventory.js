// ================= REGISTER GLOBAL FUNCTIONS =================
window.openInventory = openInventory;
window.closeInventory = closeInventory;
window.renderInventory = renderInventory;
window.getSelectedItem = getSelectedItem;
window.clearSelectedItem = clearSelectedItem;


// ================= OPEN / CLOSE =================
function openInventory() {
    const modal = document.getElementById("inventoryModal");
    if (!modal) return;

    modal.style.display = "block";
}

function closeInventory() {
    const modal = document.getElementById("inventoryModal");
    if (!modal) return;

    modal.style.display = "none";
}


// ================= RENDER INVENTORY =================
function renderInventory(inv) {

    if (!inv) return;

    const container = document.getElementById("inventoryContent");
    if (!container) return;

    container.innerHTML = "";

    const items = [
        { name: "FOOD", icon: "🍞" },
        { name: "WOOD", icon: "🪵" },
        { name: "ORE", icon: "⛏️" },
        { name: "GOLD", icon: "💰" },

        { name: "SEEDS", icon: "🌾" },
        { name: "SAPLING", icon: "🌱" },

        { name: "WHEAT_SEEDS", icon: "🌿" },
        { name: "CORN_SEEDS", icon: "🌽" },
        { name: "POTATO_SEEDS", icon: "🥔" },

        { name: "OAK_SAPLING", icon: "🌳" },
        { name: "PINE_SAPLING", icon: "🌲" }
    ];

    const grid = document.createElement("div");
    grid.className = "inventory-grid";

    container.appendChild(grid);

    items.forEach(item => {

        const amount = inv[item.name] ?? 0;
        if (amount <= 0) return;

        const slot = document.createElement("div");
        slot.className = "inv-item";

        if (worldState.selectedItem === item.name) {
            slot.classList.add("selected");
        }

        slot.innerHTML = `
            <div style="font-size:22px">${item.icon}</div>
            <div class="inv-count">${amount}</div>
        `;

        slot.onclick = () => {

    worldState.selectedItem =
        worldState.selectedItem === item.name ? null : item.name;

    worldState.hotbar[worldState.selectedHotbarSlot] = item.name;

    renderHotbar();
    renderInventory(inv);
};

        grid.appendChild(slot);
    });
}


// ================= GET SELECTED ITEM =================
function getSelectedItem() {
    return worldState.selectedItem;
}


// ================= CLEAR SELECTION =================
function clearSelectedItem() {
    worldState.selectedItem = null;
}
