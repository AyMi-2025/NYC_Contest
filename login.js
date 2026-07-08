import { auth } from "./js/firebase-config.js";
import { getPostAuthDestination } from "./js/auth-guard.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// NOTE: dark mode toggle is intentionally NOT handled here.
// script.js (also loaded on this page) already attaches a click
// listener to #lightBtn for the whole site. A second listener here
// would double-toggle the class on every click and cancel itself out.

// ---------- Login ----------
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const loginSubmitBtn = document.querySelector("#loginSubmitBtn");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginError.classList.remove("show");

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value;

    loginSubmitBtn.disabled = true;
    loginSubmitBtn.textContent = "Logging in...";

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            console.log("[login] Firebase auth succeeded for:", userCredential.user.uid);

            try {
                const destination = await getPostAuthDestination(userCredential.user, "");
                console.log("[login] Redirecting to:", destination);
                window.location.href = destination;
            } catch (err) {
                console.error("[login] getPostAuthDestination failed:", err);
                loginError.textContent = "Logged in, but couldn't load your profile. Please check your connection and try again.";
                loginError.classList.add("show");
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.textContent = "Submit";
            }
        })
        .catch((err) => {
            console.error("[login] signInWithEmailAndPassword failed:", err.code, err.message);
            loginError.textContent = friendlyError(err.code);
            loginError.classList.add("show");
            loginSubmitBtn.disabled = false;
            loginSubmitBtn.textContent = "Submit";
        });
});

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
        default:
            return "Something went wrong. Please try again.";
    }
}
