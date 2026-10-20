let inputbox = document.querySelector("#inputbox");
let list = document.querySelector("#list");
let addBtn = document.querySelector("#addBtn");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display saved tasks
tasks.forEach(function (task) {
    addItem(task);
});

// Add task when Enter is pressed
inputbox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Add task when button is clicked
addBtn.addEventListener("click", function () {
    addTask();
});

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    let task = inputbox.value.trim();

    if (task === "") return;

    tasks.push(task);
    saveTasks();

    addItem(task);

    inputbox.value = "";
}

// Create task element
function addItem(task) {
    let listItem = document.createElement("li");

    listItem.innerHTML = `
        <span class="task-text">${task}</span>
        <button class="edit-btn">Edit</button>
        <i></i>
    `;

    setupEdit(listItem, task);
    setupComplete(listItem);
    setupDelete(listItem, task);

    list.appendChild(listItem);
}

// Toggle completed task
function setupComplete(listItem) {
    listItem.addEventListener("click", function () {
        this.classList.toggle("done");
    });
}

// Delete task
function setupDelete(listItem, task) {
    let deleteBtn = listItem.querySelector("i");

    deleteBtn.addEventListener("click", function (event) {
        event.stopPropagation();

        tasks = tasks.filter(function (item) {
            return item !== task;
        });

        saveTasks();

        listItem.remove();
    });
}

// Edit task
function setupEdit(listItem, task) {
    let editBtn = listItem.querySelector(".edit-btn");

    editBtn.addEventListener("click", function (event) {
        event.stopPropagation();

        if (editBtn.textContent === "Edit") {
            enableEditMode(listItem, editBtn);
        } else {
            task = saveEditedTask(listItem, editBtn, task);
        }
    });
}

// Switch to edit mode
function enableEditMode(listItem, editBtn) {
    let taskText = listItem.querySelector(".task-text");

    let input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.className = "edit-input";

    taskText.replaceWith(input);

    input.focus();

    editBtn.textContent = "Save";
}

// Save edited task
function saveEditedTask(listItem, editBtn, oldTask) {
    let input = listItem.querySelector(".edit-input");
    let newTask = input.value.trim();

    if (newTask === "") return oldTask;

    let index = tasks.indexOf(oldTask);

    if (index !== -1) {
        tasks[index] = newTask;
        saveTasks();
    }

    let span = document.createElement("span");
    span.className = "task-text";
    span.textContent = newTask;

    input.replaceWith(span);

    editBtn.textContent = "Edit";

    return newTask;
}