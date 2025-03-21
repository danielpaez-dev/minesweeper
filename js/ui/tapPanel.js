import { reveal } from "../app.js";

export function showActionPanel(cell, cellElement) {
    const template = document.getElementById("action-panel");
    const panelFragment = template.content.cloneNode(true);
    const panel = panelFragment.firstElementChild;
    const cellSize = cell.boardInstance._cellSize;
    const existingPanels = cellElement.getElementsByClassName("action-panel");
    while (existingPanels.length > 0) {
        existingPanels[0].remove();
    }

    panel.style.width = `${cellSize * 1.2}px`;
    panel.style.height = `${cellSize * 1.2}px`;

    // Posicionar el panel centrado sobre la celda
    panel.style.position = 'absolute';
    panel.style.top = '50%';
    panel.style.left = '50%';
    panel.style.transform = 'translate(-50%, -50%)';

    cellElement.style.position = 'relative';


    // Identificar botones e imágenes dentro del panel
    const actionClickButton = panel.querySelector(".action-click");
    const actionClickImg = actionClickButton.querySelector("img");
    const actionContextmenuButton = panel.querySelector(".action-contextmenu");
    const actionContextmenuImg = actionContextmenuButton.querySelector("img");

    function closePanel() {
        if (panel.parentNode) {
            panel.parentNode.removeChild(panel);
        }
        document.removeEventListener("click", handleClickOutside);
    }

    function handleClickOutside(event) {
        if (!panel.contains(event.target) && !cellElement.contains(event.target)) {
            closePanel();
        }
    }

    // Agregar el evento de clic fuera del panel
    document.addEventListener("click", handleClickOutside);

    actionClickImg.addEventListener("click", () => {
        reveal(cell);
        closePanel();
    });

    actionContextmenuImg.addEventListener("click", () => {
        const event = new Event("contextmenu", { bubbles: true, cancelable: true });
        cellElement.dispatchEvent(event); // Simula el clic derecho en la celda
        closePanel();
    });

    cellElement.appendChild(panel);
}