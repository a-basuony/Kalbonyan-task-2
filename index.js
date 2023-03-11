const colsContainer = document.querySelector(".container");
const arrOfColData = [
  {
    title: "not started",
    id: 1,
    color: "#E35D5E",
  },
  {
    title: "in progress",
    id: 2,
    color: "#F1CA7F",
  },
  {
    title: "completed",
    id: 3,
    color: "#B7D2CD",
  },
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || {
  "not started": [],
  "in progress": [],
  completed: [],
};

for (const col of arrOfColData) {
  const createParentCard = document.createElement("div");
  createParentCard.classList = "parent-card";
  createParentCard.setAttribute("id", `${col.title}`);
  createParentCard.setAttribute("style", `--i:${col.color}`);
  createParentCard.innerHTML = `
        <p class="title">${col.title}</p>
        <div class="add-task">
            <input type="text" placeholder="Add Task" id="${col.title}-task"/>
            <button  onclick="addTask('${col.title}')">+</button>
        </div>
    `;
  colsContainer.appendChild(createParentCard);
}

// ---------------------------------------------

function addTask(columnId) {
  const taskName = document.getElementById(`${columnId}-task`).value;
  // console.log(taskName);
  if (taskName) {
    tasks[columnId].push(taskName);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTask(taskName, columnId);
    document.getElementById(`${columnId}-task`).value = "";
  }
  window.location.reload();
}

function createTask(taskName, columnId) {
  const task = document.createElement("div");
  task.classList.add("div-task");
  task.setAttribute("draggable", true);
  task.setAttribute("id", `${taskName}`);
  task.innerHTML = `
        <input type="text" value="${taskName}" disabled>
    `;
  const divIcon = document.createElement("div");
  divIcon.classList.add("icon");
  divIcon.innerHTML = `
    <ion-icon name="create-outline" class="edit" onclick="enableEdit('${taskName}')"></ion-icon>
    <ion-icon name="close-circle-outline" class="delete" onclick="deleteTask('${taskName}')"></ion-icon>
    `;
  task.appendChild(divIcon);
  const listTask = document.getElementById(columnId);
  listTask.insertBefore(task, listTask.children[1]);
}

function enableEdit(taskName) {
  const task = document.getElementById(taskName);
  task.querySelector("input[type='text']").removeAttribute("disabled");
  task.querySelector("input[type='text']").style.border = "1px solid #333";
  task.querySelector("input[type='text']").style.borderRadius = "0.3rem";
  task.querySelector("input[type='text']").focus();
  task
    .querySelector(".edit")
    .setAttribute("onclick", `saveEdit('${taskName}')`);
}

function saveEdit(taskName) {
  const task = document.getElementById(taskName);
  const newTaskName = task.querySelector("input[type='text']").value;
  tasks[getTaskColumn(taskName)].push(newTaskName);
  task.setAttribute("id", newTaskName);
  task.querySelector("input[type='text']").setAttribute("disabled", true);
  task
    .querySelector(".edit")
    .setAttribute("onclick", `enableEdit('${newTaskName}')`);
  tasks["not started"] = tasks["not started"].filter(
    (task) => task !== taskName
  );
  tasks["in progress"] = tasks["in progress"].filter(
    (task) => task !== taskName
  );
  tasks["completed"] = tasks["completed"].filter((task) => task !== taskName);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  window.location.reload();
}

function getTaskColumn(taskName) {
  if (tasks["not started"].includes(taskName)) {
    return "not started";
  } else if (tasks["in progress"].includes(taskName)) {
    return "in progress";
  } else if (tasks["completed"].includes(taskName)) {
    return "completed";
  }
}

function deleteTask(taskName) {
  const task = document.getElementById(taskName);
  tasks["not started"] = tasks["not started"].filter(
    (task) => task !== taskName
  );
  tasks["in progress"] = tasks["in progress"].filter(
    (task) => task !== taskName
  );
  tasks["completed"] = tasks["completed"].filter((task) => task !== taskName);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  task.parentNode.removeChild(task);
}

// ---------------------------------------------
const notStarted = document.getElementById("not started");
const inProgress = document.getElementById("in progress");
const completed = document.getElementById("completed");

function App() {
  tasks["not started"].forEach((taskName) =>
    createTask(taskName, "not started")
  );
  tasks["in progress"].forEach((taskName) =>
    createTask(taskName, "in progress")
  );
  tasks["completed"].forEach((taskName) => createTask(taskName, "completed"));
}
App();
const allCols = document.querySelectorAll(".parent-card");
// console.log(allCols);
let items = document.querySelectorAll(".div-task");
let drag = null;
items.forEach((column) => {
  column.addEventListener("dragstart", () => {
    drag = column;
    column.style = "opacity:0.5";
  });

  column.addEventListener("dragend", () => {
    drag = null;
    column.style = "opacity:1";
  });

  allCols.forEach((col) => {
    col.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.style.background = " rgba( 255, 255, 255, 0.1 )";
    });
    col.addEventListener("dragleave", function () {
      this.style.background = " none";
    });
    col.addEventListener("drop", function (e) {
      e.preventDefault();
      this.insertBefore(drag, this.children[1]);
      this.style.background = " none";
      const taskColumn = getTaskColumn(drag.id);
      console.log(taskColumn + " " + col.id);
      tasks[taskColumn] = tasks[taskColumn].filter((task) => task !== drag.id);
      tasks[col.id].push(drag.querySelector("input[type='text']").value);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
  });
});
