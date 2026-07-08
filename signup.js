import { auth, db } from "./js/firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// NOTE: dark mode toggle is intentionally NOT handled here.
// script.js (also loaded on this page) already attaches a click
// listener to #lightBtn for the whole site. A second listener here
// would double-toggle the class on every click and cancel itself out.

// ---------- Sign up ----------
const signupForm = document.querySelector("#signupForm");
const signupError = document.querySelector("#signupError");
const signupSubmitBtn = document.querySelector("#signupSubmitBtn");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signupError.classList.remove("show");

    const email = document.querySelector("#signupEmail").value.trim();
    const password = document.querySelector("#signupPassword").value;

    signupSubmitBtn.disabled = true;
    signupSubmitBtn.textContent = "Creating account...";

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Every new signup is, by definition, a first-time user —
            // seed their user doc with questionnaireCompleted: false.
            // No need to check Firestore here at all: a brand-new
            // account can only ever go to the questionnaire.
            try {
                await setDoc(
                    doc(db, "users", userCredential.user.uid),
                    { questionnaireCompleted: false },
                    { merge: true }
                );
            } catch (err) {
                console.warn("Could not initialize user doc in Firestore.", err);
            }

            window.location.href = "pages/questionnaire.html";
        })
        .catch((err) => {
            signupError.textContent = friendlyError(err.code);
            signupError.classList.add("show");
            signupSubmitBtn.disabled = false;
            signupSubmitBtn.textContent = "Submit";
        });
});

function friendlyError(code) {
    switch (code) {
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        default:
            return "Something went wrong. Please try again.";
    }
}
