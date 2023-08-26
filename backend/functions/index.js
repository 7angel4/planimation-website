/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const corsHandler = cors({ origin: true });

const submitSuggestion = functions.https.onRequest((req, res) => {
    corsHandler(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        const email = req.body.email;
        const message = req.body.message;

        // Generate a server-side timestamp using JavaScript's Date object
        const serverTimestamp = new Date();

        return db.collection('suggestions').add({
            email: email,
            message: message,
            timestamp: serverTimestamp
        })
        .then(() => {
            functions.logger.info("Suggestion submitted successfully!", {structuredData: true});
            res.status(200).json({ message: 'Suggestion submitted successfully!' }); // Send JSON response
        })
        .catch(error => {
            functions.logger.error('Error submitting suggestion:', error);
            res.status(500).json({ error: 'Internal Server Error' }); // Send JSON response
        });
    });
});

exports.submitSuggestion = submitSuggestion;
