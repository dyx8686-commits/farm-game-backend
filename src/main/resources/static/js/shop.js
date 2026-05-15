console.log("SHOP JS LOADED");

window.openShop = openShop;
window.closeShop = closeShop;
window.showShopTab = showShopTab;

function openShop() {
    document.getElementById("shopModal").style.display = "block";
    showShopTab("buy");
}

function closeShop() {
    document.getElementById("shopModal").style.display = "none";
}

function showShopTab(tab) {

    const container = document.getElementById("shopContent");
    container.innerHTML = "";

    const items = [
        { name: "WHEAT_SEEDS", icon: "🌾", price: 10 },
        { name: "CORN_SEEDS", icon: "🌽", price: 15 },
        { name: "POTATO_SEEDS", icon: "🥔", price: 12 },
        { name: "OAK_SAPLING", icon: "🌳", price: 20 },
        { name: "PINE_SAPLING", icon: "🌲", price: 25 }
    ];

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";
    grid.style.gap = "12px";

    container.appendChild(grid);

    items.forEach(item => {

        const card = document.createElement("div");

        card.style.background = "#3a3a3a";
        card.style.padding = "12px";
        card.style.borderRadius = "10px";
        card.style.textAlign = "center";
        card.style.cursor = "pointer";

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
                const res = await fetch(BASE + "/game/buy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: playerName,
                        item: item.name,
                        price: item.price
                    })
                });

                if (!res.ok) {
                    alert("Buy failed");
                    return;
                }

                load();

            } catch (e) {
                console.error(e);
            }
        };

        grid.appendChild(card);
    });
}
