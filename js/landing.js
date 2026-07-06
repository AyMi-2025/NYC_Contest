// ============================================================
// SIFT Landing Page — "Start Your Journey" routing
//
// Not logged in            -> login.html
// Logged in, questionnaire
//   not completed          -> pages/questionnaire.html
// Logged in, questionnaire
//   completed              -> dashboard.html
//
// Firestore failures show an inline error instead of silently
// guessing a destination (per the no-silent-redirect requirement).
// ============================================================

import { getCurrentUser, getPostAuthDestination } from "./auth-guard.js";

const startBtn = document.getElementById("startJourneyBtn");

if (startBtn) {
    startBtn.addEventListener("click", handleStartJourney);
}

async function handleStartJourney() {
    const originalLabel = startBtn.innerHTML;
    startBtn.disabled = true;
    startBtn.innerHTML = "Loading...";

    try {
        const user = await getCurrentUser();

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        // rootPrefix is "" because index.html is at the project root.
        const destination = await getPostAuthDestination(user, "");
        window.location.href = destination;

    } catch (err) {
        console.error("Could not determine where to send you:", err);
        startBtn.disabled = false;
        startBtn.innerHTML = originalLabel;
        showStartJourneyError();
    }
}

/**
 * Shows a small inline error near the button rather than silently
 * falling back to any particular page. Reuses the site's existing
 * .error-msg styling (defined in style.css for the auth forms).
 */
function showStartJourneyError() {
    let errorEl = document.getElementById("startJourneyError");

    if (!errorEl) {
        errorEl = document.createElement("div");
        errorEl.id = "startJourneyError";
        errorEl.className = "error-msg show";
        errorEl.style.marginTop = "14px";
        errorEl.textContent = "We couldn't check your account right now. Please check your connection and try again.";
        startBtn.insertAdjacentElement("afterend", errorEl);
    } else {
        errorEl.classList.add("show");
    }
}
