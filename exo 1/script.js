const title = document.createElement("h1");
title.textContent = "Liste de tache";

const input = document.createElement("input");
input.placeholder = "Ajouter une tache";
input.style.marginRight = "3rem";

const inputDate = document.createElement("input");
inputDate.classList.add("now")
inputDate.type = "date";
inputDate.style.marginRight = "3rem";

const button = document.createElement("button");
button.textContent = "Ajouter";
button.classList.add("btn", "btn-primary");

const warm = document.createElement("p");
warm.style.color = "#dc3545"

const titleIn = document.createElement("h2");
titleIn.textContent = "Taches en cours";

const ulIn = document.createElement("ul");
ulIn.classList.add("in");
ulIn.style.paddingLeft = "0";
ulIn.style.display = "flex";
ulIn.style.flexDirection = "column";
ulIn.style.gap = "1rem";

const titleOut = document.createElement("h2");
titleOut.textContent = "Tache complete";

const ulOut = document.createElement("ul");
ulOut.style.paddingLeft = "0";
ulOut.style.display = "flex";
ulOut.style.flexDirection = "column";
ulOut.style.gap = "1rem";

document.body.append(title);
document.body.append(input);
document.body.append(inputDate);
document.body.append(button);
document.body.append(warm);
document.body.append(titleIn);
document.body.append(ulIn);
document.body.append(titleOut);
document.body.append(ulOut);

document.querySelector(".now").value = new Date().toISOString().substring(0, 10);
button.addEventListener("click", createTask);

function createTask() {
    if (input.value == "") {
        return;
    };

    if (isSame(input.value)) return;

    warm.textContent = "";

    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.textContent = input.value;

    const spanDate = document.createElement("span");
    spanDate.textContent = new Date(inputDate.value).toLocaleDateString('fr-FR');
    if (new Date().toLocaleDateString('fr-FR') == new Date(inputDate.value).toLocaleDateString('fr-FR')) {
        spanDate.style.color = "orange"
    } else if (new Date().getTime() >= new Date(inputDate.value).getTime()) {
        spanDate.style.color = "red"
    } else {
        spanDate.style.color = "green"
    }

    const boxButton = document.createElement("div");
    boxButton.style.display = "flex";
    boxButton.style.gap = "1rem";

    const btnModify = document.createElement("button");
    btnModify.textContent = "Modifier";
    btnModify.classList.add("btn", "btn-primary", "modify");

    const btnEnd = document.createElement("button");
    btnEnd.textContent = "Terminer";
    btnEnd.classList.add("btn", "btn-green");

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Supprimer";
    btnDelete.classList.add("btn", "btn-red");

    input.value = "";
    btnModify.addEventListener("click", modifyTask);
    btnEnd.addEventListener("click", endTask);
    btnDelete.addEventListener("click", deleteTask);

    ulIn.append(li);
    li.append(spanDate);
    li.append(boxButton);
    boxButton.append(btnModify);
    boxButton.append(btnEnd);
    boxButton.append(btnDelete);
};

function isSame(compare, method) {
    if (method === "alert") {
        for (let same of ulOut.children) {
            if (compare == same.firstChild.textContent) {
                warm.textContent = "Une tache avec ce nom existe deja, vous pouvez modifier son nom...";
                setTimeout(function() {
                    warm.textContent = ""
                }, 5000)
                return true;
            };
        };
    } else if (method == "alert-modify") {
        const bigest = Math.max(ulIn.children.length, ulOut.children.length);
        for (i = 0; i < bigest; i++) {
            for (let same of ulIn.children) {
                if (compare == "") {
                    warm.textContent = "Le nom de la tâche ne peut pas être vide";
                    setTimeout(function() {
                        warm.textContent = ""
                    }, 5000)
                    return true;
                } else if (compare == same.firstChild.textContent) {
                    warm.textContent = "Une tache avec ce nom existe deja. !";
                    setTimeout(function() {
                        warm.textContent = ""
                    }, 5000)
                    return true;
                };
            };
            for (let same of ulOut.children) {
                if (compare == same.firstChild.textContent) {
                    warm.textContent = "Une tache avec ce nom existe deja, vous pouvez modifier son nom...";
                    setTimeout(function() {
                        warm.textContent = ""
                    }, 5000)
                    return true;
                };
            };
        };
    } else {
        for (let same of ulIn.children) {
            if (compare == same.firstChild.textContent) {
                warm.textContent = "Une tache avec ce nom existe deja, modifier le nom de la tache";
                setTimeout(function() {
                    warm.textContent = ""
                }, 5000)
                return true;
            };
        };
    };
    return false;
};

function modifyTask(event) {
    let btn = event.target;
    btn.textContent = "Valider"
    let li = this.closest("li");
    let input = document.createElement("input");
    input.value = li.firstChild.textContent;
    li.replaceChild(input, li.firstChild);
    btn.replaceWith(btn.cloneNode(true));
    let newBtn = li.querySelector(".modify");
    newBtn.addEventListener("click", function() {
        if (isSame(input.value, "alert-modify")) return;
        let span = document.createElement("span");
        li.replaceChild(span, input);
        span.textContent = input.value;
        newBtn.textContent = "Modifier";
        newBtn.replaceWith(newBtn.cloneNode(true));
        const resetBtn = li.querySelector(".modify");
        resetBtn.addEventListener("click", modifyTask);
    });
};

function endTask(event) {
    
    if (this.closest("ul").classList.contains("in")) {
        if (isSame(this.closest("li").firstChild.textContent, "alert")) return;
        this.classList.replace("btn-green", "btn-yellow");
        event.target.textContent = "En cours";
        ulOut.append(this.closest("li"));
    } else {
        if (isSame(this.closest("li").firstChild.textContent, "")) return;
        this.classList.replace("btn-yellow", "btn-green");
        event.target.textContent = "Terminer";
        ulIn.append(this.closest("li"));
    };
};

function deleteTask() {
    this.closest("li").remove();
};