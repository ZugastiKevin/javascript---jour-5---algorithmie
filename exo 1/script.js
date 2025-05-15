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

function Task(text, date, status) {
    this.text = text;
    this.date = date;
    this.status = status;
};

function refreshViews() {
    const taskFromStorage = JSON.parse(localStorage.getItem('task')) ?? [];
    ulIn.innerHTML = '';
    ulOut.innerHTML = '';
    
    taskFromStorage.forEach((task, index) => {
        const listTask = document.createElement('li');
        listTask.style.display = "flex";
        listTask.style.justifyContent = "space-between";
        listTask.textContent = task.text;
        listTask.dataset.index = index;

        // block setup date html
        const spanDate = document.createElement("span");
        spanDate.textContent = task.date;
        if (new Date().toLocaleDateString('fr-FR') == task.date) {
            spanDate.style.color = "orange";
        } else if (new Date().getTime() >= new Date(task.date).getTime()) {
            spanDate.style.color = "red";
        } else {
            spanDate.style.color = "green";
        };

        // block setup bouton html
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

        // block ecoute de bouton
        btnModify.addEventListener("click", modifyTask);
        btnEnd.addEventListener("click", endTask);
        btnDelete.addEventListener("click", deleteTask);

        // block html
        if (task.status == false) {
            ulIn.append(listTask);
            listTask.append(spanDate);
            listTask.append(boxButton);
            boxButton.append(btnModify);
            boxButton.append(btnEnd);
            boxButton.append(btnDelete);
        } else {
            ulOut.append(listTask);
            listTask.append(spanDate);
            listTask.append(boxButton);
            boxButton.append(btnModify);
            boxButton.append(btnEnd);
            boxButton.append(btnDelete);
        };
    });
};

function createTask() {
    let taskFromStorage = JSON.parse(localStorage.getItem('task')) ?? [];

    if (input.value === "") return;
    if (isSame(input.value)) return;

    warm.textContent = "";
    taskFromStorage.push(new Task(input.value, new Date(inputDate.value).toLocaleDateString('fr-FR'), false))
    localStorage.setItem('task', JSON.stringify(taskFromStorage))

    input.value = "";
    refreshViews()
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

function modifyTask() {
    const li = this.closest("li");
    const index = li.dataset.index;
    const taskFromStorage = JSON.parse(localStorage.getItem('task')) ?? [];

    const inputField = document.createElement("input");
    inputField.value = li.firstChild.textContent;
    li.replaceChild(inputField, li.firstChild);

    const btn = this;
    btn.textContent = "Valider"
    btn.onclick = () => {
        if (isSame(inputField.value, "alert-modify")) return;
        taskFromStorage[index].text = inputField.value;
        localStorage.setItem('task', JSON.stringify(taskFromStorage));

        const span = document.createElement("span");
        span.textContent = inputField.value;
        li.replaceChild(span, inputField);

        btn.textContent = "Modifier";
        btn.onclick = modifyTask;
    };
};

function endTask() {
    const li = this.closest("li");
    const index = li.dataset.index;
    const taskFromStorage = JSON.parse(localStorage.getItem('task')) ?? [];

    taskFromStorage[index].status = !taskFromStorage[index].status;
    localStorage.setItem('task', JSON.stringify(taskFromStorage));
    refreshViews();
};

function deleteTask() {
    const li = this.closest("li");
    const index = li.dataset.index;
    let taskFromStorage = JSON.parse(localStorage.getItem('task')) ?? [];

    taskFromStorage.splice(index, 1);
    localStorage.setItem('task', JSON.stringify(taskFromStorage));
    refreshViews();
};

refreshViews()