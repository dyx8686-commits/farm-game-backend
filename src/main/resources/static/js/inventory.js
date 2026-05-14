window.renderInventory = renderInventory;


// открыть / закрыть инвентарь
function openInventory() {
    const inv = document.getElementById("inventory");
    if (!inv) return;

    if (inv.style.display === "block") {
        inv.style.display = "none";
    } else {
        inv.style.display = "block";
    }
}

// рендер инвентаря
function renderInventory(inv) {

    const inventory = document.getElementById("inventory");
    if (!inventory) return;

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

    // header + grid
    inventory.innerHTML = "";

const header = document.createElement("div");

header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
header.style.marginBottom = "10px";
header.style.color = "#333";
header.style.fontWeight = "bold";

header.innerHTML = `
    <span>🎒 Inventory</span>
    <button onclick="openInventory()">✖</button>
`;

inventory.appendChild(header);

const grid = document.createElement("div");
grid.className = "inventory-grid";

inventory.appendChild(grid);



    items.forEach(item => {

        const amount = inv[item.name] ?? 0;
        if (amount <= 0) return;

        const slot = document.createElement("div");
        slot.className = "inv-item";

        if (selectedItem === item.name) {
            slot.classList.add("selected");
        }

        slot.innerHTML = `
            <div style="font-size:22px">${item.icon}</div>
            <div class="inv-count">${amount}</div>
        `;

        slot.onclick = () => {

            selectedItem =
                selectedItem === item.name ? null : item.name;

            renderInventory(inv);
        };

        grid.appendChild(slot);
    });
}

// получить выбранный предмет
function getSelectedItem() {
    return selectedItem;
}

// очистка выбора
function clearSelectedItem() {
    selectedItem = null;
}
window.openInventory = openInventory;

