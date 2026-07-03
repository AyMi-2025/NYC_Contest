import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ---------- Dark mode toggle ----------
const btn = document.querySelector('#lightBtn');
const body = document.querySelector("body");

btn.addEventListener("click", () => {
    if(body.classList.toggle('darkMode')){
        btn.textContent = "☀️";
    }else{
        btn.textContent = "🌙";
    }
})

// ---------- Navbar auth state ----------
const loggedOutLinks = document.querySelector("#loggedOutLinks");
const loggedInLinks = document.querySelector("#loggedInLinks");
const userEmailLabel = document.querySelector("#userEmailLabel");
const logoutBtn = document.querySelector("#logout");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loggedOutLinks.style.display = "none";
        loggedInLinks.style.display = "flex";
        userEmailLabel.textContent = user.email;
    } else {
        loggedOutLinks.style.display = "inline";
        loggedInLinks.style.display = "none";
    }
});

logoutBtn.addEventListener("click", () => {
    signOut(auth);
});