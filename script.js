const btn = document.querySelector('#lightBtn');
const body = document.querySelector("body");
const signup = document.querySelector("#signup");
const login = document.querySelector('login');

const form = document

btn.addEventListener("click", () => {
    if(body.classList.toggle('darkMode')){
        btn.textContent = "🌙";
    }else{
        btn.textContent = "☀️";
    }
})


// ---------- Hamburger menu (mobile) ----------
const hamburgerBtn = document.querySelector('#hamburgerBtn');
const navLinks = document.querySelector('#navLinks');

hamburgerBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburgerBtn.classList.toggle('ri-menu-line', !isOpen);
    hamburgerBtn.classList.toggle('ri-close-line', isOpen);
});

// close the menu automatically once a nav item is tapped (mobile UX)
navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "H4" || e.target.tagName === "BUTTON" || e.target.tagName === "A") {
        navLinks.classList.remove('active');
        hamburgerBtn.classList.remove('ri-close-line');
        hamburgerBtn.classList.add('ri-menu-line');
    }
});

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
