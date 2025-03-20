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

    // Identificar botones e imágenes dentro del panel
    const actionClickButton = panel.querySelector(".action-click");
    const actionClickImg = actionClickButton.querySelector("img");
    const actionContextmenuButton = panel.querySelector(".action-contextmenu");
    const actionContextmenuImg = actionContextmenuButton.querySelector("img");

    const buttonSize = cellSize + (cellSize * 30) / 100;
    actionClickButton.style.width = `${buttonSize}px`;
    actionClickButton.style.height = `${buttonSize}px`;
    actionClickButton.style.borderRadius = "50%";

    actionContextmenuButton.style.width = `${buttonSize}px`;
    actionContextmenuButton.style.height = `${buttonSize}px`;
    actionContextmenuButton.style.borderRadius = "50%";

    function closePanel() {
        if (panel.parentNode) {
            panel.parentNode.removeChild(panel);
        }
        document.removeEventListener("click", handleClickOutside); // Eliminar el evento de clic al cerrar el panel
    }

    // Función para manejar clics fuera del panel
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

// TODO: Arreglar que el menú mueva el número de debajo, no permitir el panel si la celda ha sido revelada
