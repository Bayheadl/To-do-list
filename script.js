const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const prioritySelect = document.getElementById("priority");
const ongoingList = document.getElementById("ongoingList");
const doneList = document.getElementById("doneList");
const clearAllBtn = document.getElementById("clearAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  document.getElementById("totalTasks").textContent = `Total: ${tasks.length}`;
  document.getElementById("ongoingTasks").textContent = `Ongoing: ${tasks.filter(t => t.status === "ongoing").length}`;
  document.getElementById("doneTasks").textContent = `Done: ${tasks.filter(t => t.status === "done").length}`;
}

function renderTasks() {
  ongoingList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.status === "done") li.classList.add("done-task");

    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("priority", task.priority);
    if (task.priority === "high") prioritySpan.textContent = "🔴";
    if (task.priority === "medium") prioritySpan.textContent = "🟡";
    if (task.priority === "low") prioritySpan.textContent = "🟢";

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = task.text;
      inputEdit.style.marginRight = "10px";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "✔️"; // ← طلبك
      saveBtn.onclick = () => {
        task.text = inputEdit.value;
        saveTasks();
        renderTasks();
      };

      li.replaceChild(inputEdit, textSpan);
      li.replaceChild(saveBtn, editBtn);
      inputEdit.focus();
    };

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✅";
    doneBtn.onclick = () => {
      task.status = "done";
      saveTasks();
      renderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(prioritySpan);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    if (task.status !== "done") li.appendChild(doneBtn);
    li.appendChild(deleteBtn);

    if (task.status === "done") {
      doneList.appendChild(li);
    } else {
      ongoingList.appendChild(li);
    }
  });

  updateStats();
}

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const priorityValue = prioritySelect.value;

  if (taskText === "") return;

  const newTask = {
    text: taskText,
    priority: priorityValue,
    status: "ongoing"
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  prioritySelect.value = "medium";
});

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

renderTasks();