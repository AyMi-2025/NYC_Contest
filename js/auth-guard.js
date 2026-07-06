// ============================================================
// SIFT Auth Guard — shared helper
// Single source of truth for "where should this user go?" so
// login.js, signup.js, the landing page, dashboard.js, and
// questionnaire.js all make the same decision the same way
// instead of each re-implementing the Firestore check.
//
// Import path note: this file lives in js/, so from the project
// root import it as "./js/auth-guard.js", and from pages/ as
// "../js/auth-guard.js".
// ============================================================

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export { auth, db };

/**
 * Resolves once with the current Firebase user (or null), using
 * onAuthStateChanged rather than auth.currentUser directly — this
 * matters because auth.currentUser can briefly be null on page load
 * before Firebase has finished restoring the session from storage.
 * Using this instead of a raw currentUser check is what prevents
 * false "not logged in" redirects right after a refresh.
 */
export function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * Reads users/{uid}.questionnaireCompleted from Firestore.
 * Throws on failure — callers must decide how to handle that
 * (show an error, NOT silently redirect to the questionnaire).
 */
export async function isQuestionnaireCompleted(uid) {
    const snapshot = await getDoc(doc(db, "users", uid));
    return snapshot.exists() && snapshot.data().questionnaireCompleted === true;
}

/**
 * Given a signed-in user, decides where they belong:
 * dashboard.html if they've completed the questionnaire,
 * pages/questionnaire.html otherwise.
 *
 * @param {object} user - Firebase user object (must be non-null)
 * @param {string} rootPrefix - "" if the calling page is at the
 *   project root, "../" if it's one level down (e.g. in pages/).
 */
export async function getPostAuthDestination(user, rootPrefix = "") {
    const completed = await isQuestionnaireCompleted(user.uid);
    return completed ? `${rootPrefix}dashboard.html` : `${rootPrefix}pages/questionnaire.html`;
}
