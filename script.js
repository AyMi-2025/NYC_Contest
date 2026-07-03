const btn = document.querySelector('#lightBtn');
const body = document.querySelector("body");
const signup = document.querySelector("#signup");
const login = document.querySelector('login');

const form = document

btn.addEventListener("click", () => {
    if(body.classList.toggle('darkMode')){
        btn.textContent = "☀️";
    
    }else{
        btn.textContent = "🌙";
     
    }
})

  