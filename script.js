const userInput = document.querySelector(".todo-input input");
const userOutput = document.querySelector(".todo-task");
const editPend = document.querySelector(".editPend");
const clearAll = document.querySelector(".clearBtn");
const completeTask = document.querySelector(".completeBtn");
const showAll = document.querySelector(".allBtn");


let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editMode = false;
let editIndex;
let filter = 'all';

window.addEventListener('DOMContentLoaded', () => {
  getTasks();
  showAll.classList.add("border");
})

userInput.addEventListener("keyup", e => {
  let inputTask = userInput.value.trim();
  if (e.key == "Enter" && inputTask) {
    if (editMode) {
      todos[editIndex].name = inputTask;
      editMode = false;
      editPend.style.display = "none";
    }
    else {
      todos.push({ name: inputTask, status: "pending" });
    }
    localStorage.setItem("todos", JSON.stringify(todos));
    userInput.value = "";
  }
  getTasks();
})

const getTasks = () => {
  let outputTask = "";

  todos.forEach((task, index) => {
    if (filter == task.status || filter == 'all') {
      outputTask += `<li>
                      <label for="${index}">
                        <input type="checkbox" id="${index}" ${task.status == 'completed' ? 'checked' : ''} onclick="setComplete(this)">
                        <p class="${task.status == 'completed' ? 'line-through' : ''}">${task.name}</p>
                      </label>
                      <div class="todo-action">
                      <span class="material-symbols-outlined" onclick="editTask(${index})">edit</span>
                      <span class="material-symbols-outlined" onclick="deleteTask(${index})">delete</span>
                      </div>
                    </li>`
    }
  })
  userOutput.innerHTML = outputTask || `<span>You don't have any task...</span>`;
}

const setComplete = (selectedTask) => {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("line-through");
    todos[selectedTask.id].status = "completed";
  }
  else {
    taskName.classList.remove("line-through");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todos));
};

const deleteTask = (index) => {
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  getTasks();
};

const editTask = (index) => {
  editPend.style.display = "block";
  editMode = true;
  editIndex = index;
  userInput.value = todos[index].name;
}

clearAll.addEventListener("click", () => {
  showAll.classList.remove("border");
  completeTask.classList.remove("border");
  clearAll.classList.add("border");
  while (todos.length > 0) {
    todos.pop();
  }
  localStorage.setItem("todos", JSON.stringify(todos));
  getTasks();
})

completeTask.addEventListener("click", () => {
  completeTask.classList.add("border");
  showAll.classList.remove("border");
  clearAll.classList.remove("border");
  filter = "completed";
  getTasks();
});

showAll.addEventListener(("click"), () => {
  completeTask.classList.remove("border");
  showAll.classList.add("border");
  clearAll.classList.remove("border");
  filter = "all";
  getTasks();
})
