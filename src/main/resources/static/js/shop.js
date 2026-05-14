window.shopTab = "buy";

window.openShop = openShop;
window.closeShop = closeShop;
window.showShopTab = showShopTab;

// открыть
function openShop() {
    document.getElementById("shopModal").style.display = "block";
    renderShop();
}

// закрыть
function closeShop() {
    document.getElementById("shopModal").style.display = "none";
}

// переключение вкладок
function showShopTab(tab) {
    window.shopTab = tab;
    renderShop();
}

// рендер
function renderShop() {

    const container = document.getElementById("shopContent");
    if (!container) return;

    container.innerHTML = "";

    if (window.shopTab === "buy") {
        renderBuyShop(container);
    }

    if (window.shopTab === "sell") {
        renderSellShop(container);
    }
}

// BUY
function renderBuyShop(container) {

    const items = [
        { name: "WHEAT_SEEDS", icon: "🌿", price: 5 },
        { name: "CORN_SEEDS", icon: "🌽", price: 7 },
        { name: "POTATO_SEEDS", icon: "🥔", price: 6 },

        { name: "OAK_SAPLING", icon: "🌳", price: 4 },
        { name: "PINE_SAPLING", icon: "🌲", price: 6 },

        { name: "COPPER_ORE", icon: "🟫", price: 3 },
        { name: "IRON_ORE", icon: "⚙️", price: 6 }
    ];

    items.forEach(item => {

        const div = document.createElement("div");
        div.style = "padding:8px;border:1px solid #ccc;margin:5px;cursor:pointer;";

        div.innerHTML = `${item.icon} ${item.name} - ${item.price} GOLD`;

        div.onclick = () => {
            buyItem(item.name, 1);
        };

        container.appendChild(div);
    });
}

// SELL
function renderSellShop(container) {

    const inv = window.currentInventory || {};

    Object.keys(inv).forEach(key => {

        const amount = inv[key];
        if (amount <= 0) return;

        const price = getSellPrice(key);

        const div = document.createElement("div");
        div.style = "padding:8px;border:1px solid #ccc;margin:5px;cursor:pointer;";

        div.innerHTML = `${key} x${amount} → ${price} GOLD`;

        div.onclick = () => {
            sellItem(key, 1);
        };

        container.appendChild(div);
    });
}

// цены продажи
function getSellPrice(item) {

    switch(item) {

        case "WOOD": return 2;
        case "ORE": return 5;
        case "FOOD": return 1;

        case "COPPER_ORE": return 3;
        case "IRON_ORE": return 6;

        default: return 1;
    }
}

const BASE = "https://farm-game-backend-eo4y.onrender.com";

async function buyItem(item, amount) {

    const name = new URLSearchParams(window.location.search).get("name");

    await fetch(BASE + "/game/buyItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            item: item,
            amount: amount
        })
    });

    await refreshState();
}

async function sellItem(item, amount) {

    const name = new URLSearchParams(window.location.search).get("name");

    await fetch(BASE + "/game/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            item: item,
            amount: amount
        })
    });

    await refreshState();
}
async function refreshState() {

    const name = new URLSearchParams(window.location.search).get("name");

    const res = await fetch(BASE + "/game/state?name=" + name);
    const player = await res.json();

    window.currentInventory = player.inventory;

    if (window.renderInventory) {
        window.renderInventory(player.inventory);
    }

    if (window.renderShop) {
        window.renderShop();
    }
}
