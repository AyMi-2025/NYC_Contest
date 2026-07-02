const btn = document.querySelector('#lightBtn')
const body = document.querySelector("body")

btn.addEventListener("click", () => {
    if(body.classList.toggle('darkMode')){
        btn.textContent = "⏾"
    }else{
        btn.textContent = "☀︎"
    }
})