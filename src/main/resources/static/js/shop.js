
// ================= SHOP STATE =================

let shopOpen = false;

// ================= OPEN SHOP =================

async function openShop() {

    const modal = document.getElementById("shopModal");
    const content = document.getElementById("shopContent");

    if (!modal || !content) return;

    const res = await fetch(BASE + "/game/players");
    const players = await res.json();

    const player = players.find(p => p.name === playerName);
    if (!player) return;

    let shopItems = [];

    // ================= FARMER =================
    if (player.type === "FARMER") {

        shopItems = [
            { item: "WHEAT_SEEDS", icon: "🌾", price: 5 },
{ item: "CORN_SEEDS", icon: "🌽", price: 7 },
{ item: "POTATO_SEEDS", icon: "🥔", price: 6 }
        ];
    }

    // ================= WOODCUTTER =================
    if (player.type === "WOODCUTTER") {

        shopItems = [
            { item: "OAK_SAPLING", icon: "🌳", price: 4 },
{ item: "PINE_SAPLING", icon: "🌲", price: 6 }
        ];
    }

    // ================= MINER =================
    if (player.type === "MINER") {

        shopItems = [
            { item: "COPPER_ORE", icon: "🟤", price: 3 },
{ item: "IRON_ORE", icon: "⚙️", price: 6 },
{ item: "GOLD_ORE_BOX", icon: "📦", price: 10 }
        ];
    }

    content.innerHTML = `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:10px;
            font-weight:bold;
        ">
            🏪 Shop
            <button onclick="closeShop()">✖</button>
        </div>

        <div class="shop-grid"></div>
    `;

    const grid = content.querySelector(".shop-grid");

    shopItems.forEach(i => {

        const div = document.createElement("div");
        div.className = "shop-item";

        div.innerHTML = `
    <div class="shop-icon">${i.icon}</div>
    <div>${i.item}</div>
    <div class="shop-price">💰 ${i.price}</div>
`;

div.onclick = () => buyItem(i.item);

grid.appendChild(div);
    });

    modal.style.display = "block";
}

// ================= BUY ITEM =================

async function buyItem(item) {

    console.log("BUY CLICK:", item);

    const res = await fetch(
        BASE + "/game/shop/buy?name=" + playerName +
        "&item=" + item +
        "&amount=1",
        {
            method: "POST"
        }
    );

    console.log("STATUS:", res.status);

    load();
}

// ================= CLOSE SHOP =================

function closeShop() {

    const modal = document.getElementById("shopModal");

    if (!modal) return;

    modal.style.display = "none";
}
window.buyItem = buyItem;
window.openShop = openShop;
window.closeShop = closeShop;
