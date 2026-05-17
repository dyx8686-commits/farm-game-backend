console.log("SHOP JS LOADED");

function openShop() {
    const modal = document.getElementById("shopModal");
    if (!modal) return;

    modal.style.display = "block";
    showShopTab("buy");
}

function closeShop() {
    const modal = document.getElementById("shopModal");
    if (!modal) return;

    modal.style.display = "none";
}

function showShopTab(tab) {

    const container = document.getElementById("shopContent");
    if (!container) return;

    container.innerHTML = "";

    const items = tab === "buy"
        ? [
            { name: "WHEAT_SEEDS", icon: "🌾", price: 10 },
            { name: "CORN_SEEDS", icon: "🌽", price: 15 },
            { name: "POTATO_SEEDS", icon: "🥔", price: 12 },
            { name: "OAK_SAPLING", icon: "🌳", price: 20 },
            { name: "PINE_SAPLING", icon: "🌲", price: 25 }
        ]
        : [
            { name: "WHEAT", icon: "🌾", price: 5 },
            { name: "CORN", icon: "🌽", price: 8 },
            { name: "POTATO", icon: "🥔", price: 6 },
            { name: "WOOD", icon: "🪵", price: 12 },
            { name: "STONE", icon: "🪨", price: 15 }
        ];

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.style.gap = "12px";

    container.appendChild(grid);

    items.forEach(item => {

        const card = document.createElement("div");

        card.style.background = "linear-gradient(180deg, #4f4f4f, #2f2f2f)";
        card.style.padding = "14px";
        card.style.borderRadius = "14px";
        card.style.textAlign = "center";
        card.style.cursor = "pointer";
        card.style.color = "white";

        card.innerHTML = `
            <div style="font-size:34px">${item.icon}</div>
            <div>${item.name}</div>
            <div style="color:gold">${item.price} 💰</div>
        `;

        card.onclick = async () => {

            const gold = window.currentInventory?.GOLD ?? 0;

            if (gold < item.price) {
                alert("Not enough gold 💰");
                return;
            }

            try {
                const res = await fetch("https://farm-game-backend-production.up.railway.app/game/buy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: new URLSearchParams(window.location.search).get("name"),
                        item: item.name,
                        price: item.price
                    })
                });

                if (!res.ok) {
                    alert("Buy failed");
                    return;
                }

                if (typeof load === "function") {
                    load();
                }

            } catch (e) {
                console.error("BUY ERROR:", e);
            }
        };

        grid.appendChild(card);
    });
}

window.openShop = openShop;
window.closeShop = closeShop;
window.showShopTab = showShopTab;

console.log("OPEN SHOP:", typeof window.openShop);
