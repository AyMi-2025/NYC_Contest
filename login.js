import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ---------- Dark mode toggle ----------
const btn = document.querySelector('#lightBtn');
const body = document.querySelector("body");

btn.addEventListener("click", () => {
    if(body.classList.toggle('darkMode')){
        btn.textContent = "🌙";
    }else{
        btn.textContent = "☀️";
    }
})

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
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((err) => {
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