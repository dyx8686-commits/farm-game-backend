window.gameState = {
    player: null,
    inventory: {},
    plotsReady: false
};

function createPlots() {

    const container = document.getElementById("plots");
    if (!container) return;

    if (window.gameState.plotsReady) return;

    const cols = 15;
    const rows = 10;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            const cell = document.createElement("div");
            cell.className = "plot";

            cell.style.left = (x * 60) + "px";
            cell.style.top = (y * 60) + "px";

            container.appendChild(cell);
        }
    }

    window.gameState.plotsReady = true;
}
