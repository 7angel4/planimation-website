import { createButton } from './general-util.js';

const NUM_DOMAINS = 14;
const RESIZE_BTNS_CONTAINER = document.querySelector('.resize-btns-container');
const GRID = document.querySelector('.gallery');
const CAPTIONS = document.querySelectorAll('.caption');
const CAPTION_SIZE_INC = 0.02;

function addResizeButtons() {
    let plusBtn = createButton('btn', '+');
    plusBtn.onclick = increaseSize;
    let minusBtn = createButton('btn', '-');
    minusBtn.onclick = decreaseSize;

    RESIZE_BTNS_CONTAINER.appendChild(plusBtn);
    RESIZE_BTNS_CONTAINER.appendChild(minusBtn);
}

function getNumGridCols() {
    let gridStyle = window.getComputedStyle(GRID);
    let nCols = gridStyle.getPropertyValue('grid-template-columns')
                         .split(' ').length;
    return nCols;
}

function updateSize(increase) {
    let nCols = getNumGridCols();
    if (increase) {
        // increase size of thumbnails = fewer blocks per row
        nCols--;
    } else {
        nCols++;
    }
    // additional row for a visual gap at the bottom
    let nRows = Math.ceil((1.0 * NUM_DOMAINS) / nCols) + 1;
        
    // modify the properties
    updateGridProperties(nRows, nCols);
}

const increaseSize = () => updateSize(true);
const decreaseSize = () => updateSize(false);

const parseGridColumns = (nCols) => {
    let colFraction = 100 / nCols;
    let value = "";
    for (let i = 0; i < nCols; i++) {
        value += colFraction + '% ';
    }
    return value;
}

function updateGridProperties(nRows, nCols) {
    let colFraction = 100 / nCols;
    GRID.style['grid-template-columns'] = parseGridColumns(nCols);
    GRID.style['grid-template-rows'] = `repeat(${nRows}, ${nRows * 2}vw)`;
}

addResizeButtons();