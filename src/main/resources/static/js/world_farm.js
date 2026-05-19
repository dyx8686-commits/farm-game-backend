console.log("WORLD FARM LOADED");

function renderPlants(player) {

    const container = document.getElementById("plants");

    if (!container) return;

    container.innerHTML = "";

    const plots = window.plots || [];

    plots.forEach((plot, index) => {

        const plant = document.createElement("div");

        plant.style.position = "absolute";

        plant.style.left = (plot.x * 60 + 12) + "px";
        plant.style.top = (plot.y * 60 + 12) + "px";

        plant.style.width = "36px";
        plant.style.height = "36px";

        plant.style.display = "flex";
        plant.style.justifyContent = "center";
        plant.style.alignItems = "center";

        plant.style.fontSize = "28px";

        plant.style.pointerEvents = "auto";

        plant.innerText = "🌱";

        container.appendChild(plant);
    });
}
