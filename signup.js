import { auth, db, googleProvider } from "./js/firebase-config.js";
import { getPostAuthDestination, ensureUserDocExists } from "./js/auth-guard.js";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// NOTE: dark mode toggle is intentionally NOT handled here.
// script.js (also loaded on this page) already attaches a click
// listener to #lightBtn for the whole site. A second listener here
// would double-toggle the class on every click and cancel itself out.

const signupForm = document.querySelector("#signupForm");
const signupError = document.querySelector("#signupError");
const signupSubmitBtn = document.querySelector("#signupSubmitBtn");
const googleSignupBtn = document.querySelector("#googleSignupBtn");
const signupFormWrap = document.querySelector("#signupFormWrap");
const signupConfirm = document.querySelector("#signupConfirm");

// ---------- Email & Password Sign Up ----------
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    signupError.classList.remove("show");

    const email = document.querySelector("#signupEmail").value.trim();
    const password = document.querySelector("#signupPassword").value;

    signupSubmitBtn.disabled = true;
    signupSubmitBtn.textContent = "Creating account...";

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Every new signup is, by definition, a first-time user —
            // seed their user doc with questionnaireCompleted: false.
            try {
                await setDoc(
                    doc(db, "users", user.uid),
                    { questionnaireCompleted: false },
                    { merge: true }
                );
            } catch (err) {
                console.warn("Could not initialize user doc in Firestore.", err);
            }

            // Email/password accounts must verify their address before
            // they're allowed to log in and use the app (login.js
            // enforces the actual block; this just kicks off the email
            // and shows a clean confirmation instead of auto-redirecting
            // straight into the questionnaire like it used to).
            try {
                await sendEmailVerification(user);
            } catch (err) {
                console.warn("Could not send verification email.", err);
            }

            signupFormWrap.style.display = "none";
            signupConfirm.classList.add("show");
        })
        .catch((err) => {
            signupError.textContent = friendlyError(err.code);
            signupError.classList.add("show");
            signupSubmitBtn.disabled = false;
            signupSubmitBtn.textContent = "Submit";
        });
});

// ---------- Google Sign-Up / Sign-In ----------
googleSignupBtn.addEventListener("click", async () => {
    signupError.classList.remove("show");
    googleSignupBtn.disabled = true;

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // First-time Google sign-in IS the signup — there's no
        // separate step. Seed the Firestore doc only if it's new.
        await ensureUserDocExists(user.uid);

        // Google accounts are verified by Google itself, so no
        // verification email step is needed — go straight to the
        // normal post-auth routing (questionnaire or dashboard).
        const destination = await getPostAuthDestination(user, "");
        window.location.href = destination;
    } catch (err) {
        signupError.textContent = friendlyGoogleError(err.code);
        signupError.classList.add("show");
    } finally {
        googleSignupBtn.disabled = false;
    }
});

function friendlyError(code) {
    switch (code) {
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection and try again.";
        default:
            return "Something went wrong. Please try again.";
    }
}

function friendlyGoogleError(code) {
    switch (code) {
        case "auth/popup-closed-by-user":
        case "auth/cancelled-popup-request":
            return "Sign-in was cancelled.";
        case "auth/popup-blocked":
            return "Your browser blocked the sign-in popup. Please allow popups for this site and try again.";
        case "auth/account-exists-with-different-credential":
            return "An account already exists with this email using a different sign-in method. Please log in with your email and password instead.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection and try again.";
        default:
            return "Something went wrong signing in with Google. Please try again.";
    }
}
