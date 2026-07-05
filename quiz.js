async function loadQuestions() {
    const response = await fetch("data.json");
    const questions = await response.json();

    console.log(questions);
}

loadQuestions();

const options = document.querySelectorAll(".option");
const nextBtn = document.getElementById("nextBtn");

options.forEach(option=>{
    option.addEventListener("click",()=>{

        options.forEach(btn=>btn.classList.remove("selected"));

        option.classList.add("selected");

        nextBtn.disabled=false;

    });
});