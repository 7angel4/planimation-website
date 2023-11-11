import { createButton } from './general-util.js';

const NUM_DOMAINS = 14;
const RESIZE_BTNS_CONTAINER = document.querySelector('.resize-btns-container');
const GRID = document.querySelector('.gallery');
const RESIZE_BTN_CLASSNAME = 'resize-btn';

/**
 * Adds buttons for resizing the thumbnails.
 */
function addResizeButtons() {
    let plusBtn = createButton('btn', '+');
    plusBtn.classList.add(RESIZE_BTN_CLASSNAME);
    plusBtn.onclick = increaseSize;
    let minusBtn = createButton('btn', '-');
    minusBtn.onclick = decreaseSize;
    minusBtn.classList.add(RESIZE_BTN_CLASSNAME);

    RESIZE_BTNS_CONTAINER.appendChild(plusBtn);
    RESIZE_BTNS_CONTAINER.appendChild(minusBtn);
}

/**
 * Gets the number of grid columns.
 * @returns the number of columns, as an integer.
 */
function getNumGridCols() {
    let gridStyle = window.getComputedStyle(GRID);
    let nCols = gridStyle.getPropertyValue('grid-template-columns')
                         .split(' ').length;
    return nCols;
}

/**
 * Updates the size of the thumbnails, by modifying the grid dimensions.
 * @param increase: boolean value - 
 *                  true for increasing size, false for decreasing size.
 */
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

/**
 * Wrapper function for increasing the size of the thumbnails.
 */
const increaseSize = () => updateSize(true);

/**
 * Wrapper function for decreasing the size of the thumbnails.
 */
const decreaseSize = () => updateSize(false);

/**
 * Converts the number of columns to a value for the 
 * `grid-template-columns` CSS property.
 * @param nCols: integer indicating the number of grid columns.
 * @returns: string representing a `grid-template-columns` property value.
 */
const parseGridColumns = (nCols) => {
    let colFraction = 100 / nCols;
    let value = "";
    for (let i = 0; i < nCols; i++) {
        value += colFraction + '% ';
    }
    return value;
}

/**
 * Converts the number of rows to a value for the 
 * `grid-template-rows` CSS property.
 * @param nCols: integer indicating the number of grid rows.
 * @returns: string representing a `grid-template-rows` property value.
 */
const parseGridRows = (nRows) => `repeat(${nRows}, ${nRows * 2}vw)`;

/**
 * Updates the grid properties.
 * @param nRows: integer representing the number of rows.
 * @param nCols: integer representing the number of columns.
 */
function updateGridProperties(nRows, nCols) {
    let colFraction = 100 / nCols;
    GRID.style['grid-template-columns'] = parseGridColumns(nCols);
    GRID.style['grid-template-rows'] = parseGridRows(nRows);
}


addResizeButtons();