window.selectedItem = null;

window.openInventory = openInventory;
window.closeInventory = closeInventory;
window.renderInventory = renderInventory;
window.getSelectedItem = getSelectedItem;
window.clearSelectedItem = clearSelectedItem;

// открыть
function openInventory() {
    document.getElementById("inventoryModal").style.display = "block";
}

// закрыть
function closeInventory() {
    document.getElementById("inventoryModal").style.display = "none";
}

// рендер
function renderInventory(inv) {

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

        if (window.selectedItem === item.name) {
            slot.classList.add("selected");
        }

        slot.innerHTML = `
            <div style="font-size:22px">${item.icon}</div>
            <div class="inv-count">${amount}</div>
        `;

        slot.onclick = () => {

            window.selectedItem =
                window.selectedItem === item.name ? null : item.name;

            renderInventory(inv);
        };

        grid.appendChild(slot);
    });
}

// selected
function getSelectedItem() {
    return window.selectedItem;
}

function clearSelectedItem() {
    window.selectedItem = null;
}
