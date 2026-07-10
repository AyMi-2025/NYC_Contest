import { auth, googleProvider } from "./js/firebase-config.js";
import { getPostAuthDestination, ensureUserDocExists } from "./js/auth-guard.js";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// NOTE: dark mode toggle is intentionally NOT handled here.
// script.js (also loaded on this page) already attaches a click
// listener to #lightBtn for the whole site. A second listener here
// would double-toggle the class on every click and cancel itself out.

const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const loginSubmitBtn = document.querySelector("#loginSubmitBtn");
const googleLoginBtn = document.querySelector("#googleLoginBtn");
const verifyNotice = document.querySelector("#verifyNotice");
const resendBtn = document.querySelector("#resendVerificationBtn");
const resendStatus = document.querySelector("#resendStatus");

// Holds the signed-in-but-unverified user object so the Resend
// button (rendered inside verifyNotice) has someone to call
// sendEmailVerification on without re-authenticating.
let pendingUnverifiedUser = null;

// ---------- Email & Password Login ----------
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginError.classList.remove("show");
    verifyNotice.classList.remove("show");

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;

    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = "Logging in...";

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Email/password accounts must verify before proceeding.
            // (Google accounts skip this — Google already verifies
            // the email address as part of its own sign-in flow, so
            // user.emailVerified is true automatically for them.)
            if (!user.emailVerified) {
                pendingUnverifiedUser = user;
                verifyNotice.classList.add("show");
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.textContent = "Submit";
                return;
            }

            await routeAfterAuth(user);
        })
        .catch((err) => {
            loginError.textContent = friendlyError(err.code);
            loginError.classList.add("show");
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.textContent = "Submit";
        });
});

// ---------- Resend Verification Email ----------
resendBtn.addEventListener("click", async () => {
    if (!pendingUnverifiedUser) return;

    resendBtn.disabled = true;
    resendStatus.classList.remove("show");

    try {
        await sendEmailVerification(pendingUnverifiedUser);
        resendStatus.textContent = "Verification email sent. Check your inbox.";
        resendStatus.classList.add("show");
    } catch (err) {
        resendStatus.textContent = "Couldn't resend right now. Please try again shortly.";
        resendStatus.classList.add("show");
    } finally {
        resendBtn.disabled = false;
    }
});

// ---------- Google Sign-In ----------
googleLoginBtn.addEventListener("click", async () => {
    loginError.classList.remove("show");
    verifyNotice.classList.remove("show");
    googleLoginBtn.disabled = true;

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // First-time Google sign-in creates the Firebase Auth account
        // transparently — there's no separate "Google signup" step —
        // so make sure their Firestore doc exists, without touching
        // it if it's already there.
        await ensureUserDocExists(user.uid);

        // Google-verified accounts skip the email-verification gate.
        await routeAfterAuth(user);
    } catch (err) {
        loginError.textContent = friendlyGoogleError(err.code);
        loginError.classList.add("show");
    } finally {
        googleLoginBtn.disabled = false;
    }
});

/**
 * Shared post-auth routing for both email/password and Google flows:
 * checks questionnaireCompleted in Firestore and redirects. Never
 * silently guesses a destination on failure — shows an error instead.
 */
async function routeAfterAuth(user) {
    try {
        const destination = await getPostAuthDestination(user, "");
        window.location.href = destination;
    } catch (err) {
        console.error("[login] getPostAuthDestination failed:", err);
        loginError.textContent = "Logged in, but couldn't load your profile. Please check your connection and try again.";
        loginError.classList.add("show");
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = "Submit";
    }
}

function friendlyError(code) {
    switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Incorrect email or password.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
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
