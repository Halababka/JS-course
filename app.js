let todos = [];
let users = [];
const todoList = document.getElementById("todo-list");
const userSelect = document.getElementById("user-todo");
const form = document.querySelector("form");
document.addEventListener("DOMContentLoaded", createApp);
window.addEventListener("offline", () => {
    alert("Отсутствует подключение к интернету");
});
form.addEventListener("submit", handleSubmit);

function getUserName(userId) {
    const user = users.find(user => user.id === userId);
    return user.name;
}

function printTodo({id, userId, title, completed}) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} by <b>${getUserName(userId)}</b></span>`;
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = completed;
    check.addEventListener("change", handleTodoChange);
    const close = document.createElement("span");
    close.innerHTML = "&times;";
    close.className = "close";
    close.addEventListener("click", handleClose);

    li.prepend(check);
    li.append(close);
    todoList.prepend(li);
}

function createUserOption(user) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
}

function removeTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId);
    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    todo.querySelector("input").removeEventListener("change", handleTodoChange);
    todo.querySelector(".close").removeEventListener("click", handleClose);
    todo.remove();
}

function alertError(error) {
    alert(error.message);
}

function createApp() {
    Promise.all([getAllTodos(), getAllUders()])
        .then(value => {
            [todos, users] = value;
            todos.forEach(todo => printTodo(todo));
            users.forEach(user => createUserOption(user));
        });
}

function handleSubmit(event) {
    event.preventDefault();
    createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false
    });
}

function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
}

function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;
    toggleTodoCheck(todoId, completed);
}

async function getAllTodos() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        return data;
    } catch (error) {
        alertError(error);
    }
}

async function getAllUders() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();

        return data;
    } catch (error) {
        alertError(error);
    }
}

async function createTodo(todo) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
            method: "POST",
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const todoNew = await response.json();

        printTodo(todoNew);
    } catch (error) {
        alertError(error);
    }
}

async function toggleTodoCheck(todoId, completed) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: "PATCH",
            body: JSON.stringify({completed: completed}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Не получилось подключиться к серверу");
        }
    } catch (error) {
        alertError(error);
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            removeTodo(todoId);
        } else {
            throw new Error("Не получилось подключиться к серверу");
        }
    } catch (error) {
        alertError(error);
    }
}