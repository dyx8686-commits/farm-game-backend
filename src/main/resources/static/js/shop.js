
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
            { item: "SEEDS", icon: "🌾", price: 5 },
            { item: "CARROT", icon: "🥕", price: 8 },
            { item: "WHEAT", icon: "🌽", price: 10 }
        ];
    }

    // ================= WOODCUTTER =================
    if (player.type === "WOODCUTTER") {

        shopItems = [
            { item: "SAPLING", icon: "🌳", price: 12 },
            { item: "OAK_LOG", icon: "🪵", price: 15 }
        ];
    }

    // ================= MINER =================
    if (player.type === "MINER") {

        shopItems = [
            { item: "ORE_BOX", icon: "📦", price: 20 },
            { item: "IRON_ORE", icon: "⛏️", price: 25 }
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

    await fetch(
        BASE + "/game/shop/buy?name=" + playerName +
        "&item=" + item +
        "&amount=1",
        { method: "POST" }
    );

    load(); // обновить игру после покупки
}

// ================= CLOSE SHOP =================

function closeShop() {

    const modal = document.getElementById("shopModal");

    if (!modal) return;

    modal.style.display = "none";
}