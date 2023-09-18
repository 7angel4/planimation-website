import {formatString, createLiWithText} from "./util.js";

/**
 * Adds the data types from the query snapshot to the provided list element.
 * @param querySnapshot: the query snapshot holding the documents for the data types
 * @param list: the list to hold the data type values
 */
export function addDataTypesToList(querySnapshot, list) {
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const li = createLiWithText(docData.dataType);
        list.appendChild(li);
    });
}

/**
 * Adds the custom properties from the specified document.
 * @param doc: Firebase document containing information on custom properties.
 */
export function addCustomProperties(doc) {
    const note = document.getElementById("custom-prop-note");
    note.textContent = doc.data().note;
    const example = document.getElementById("custom-prop-example");
    example.setTextContent(formatString(doc.data().example));
}