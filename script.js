const showTaskFormBtn = document.getElementById("showTaskFormBtn");
const taskForm = document.getElementById("taskForm");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskTitleInput = document.getElementById("taskTitle");
const taskDeadlineInput = document.getElementById("taskDeadline");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressText = document.getElementById("progressText");
const progressFill = document.querySelector(".progress-fill");
const progressDescription = document.getElementById("progressDescription");

const saveNoteBtn = document.getElementById("saveNoteBtn");
const dailyNote = document.getElementById("dailyNote");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    title: "Laporan Praktikum Web",
    deadline: "2026-05-18",
    completed: true
  },
  {
    title: "Tugas Basis Data",
    deadline: "2026-05-20",
    completed: false
  },
  {
    title: "Resume Jaringan",
    deadline: "2026-05-22",
    completed: true
  },
  {
    title: "Project UI/UX",
    deadline: "2026-05-25",
    completed: false
  }
];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(dateString) {
  if (!dateString) {
    return "Tidak ada deadline";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `<p class="empty-task">Belum ada tugas. Tambahin dulu, masa dashboard produktivitas kosong melompong.</p>`;
    updateDashboard();
    return;
  }

  tasks.forEach(function (task, index) {
    const taskItem = document.createElement("div");
    taskItem.className = task.completed ? "task done" : "task";

    taskItem.innerHTML = `
      <div>
        <h4>${task.title}</h4>
        <p>Deadline: ${formatDate(task.deadline)}</p>
      </div>

      <div class="task-actions">
        <span>${task.completed ? "Selesai" : "Belum"}</span>

        <button class="complete-btn" onclick="toggleTask(${index})">
          ${task.completed ? "Batal" : "Selesai"}
        </button>

        <button class="delete-btn" onclick="deleteTask(${index})">
          Hapus
        </button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });

  updateDashboard();
}

function updateDashboard() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
  progressText.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
  progressDescription.textContent = `Progress semester saat ini: ${progress}%`;
}

function addTask() {
  const title = taskTitleInput.value.trim();
  const deadline = taskDeadlineInput.value;

  if (title === "") {
    alert("Nama tugas tidak boleh kosong.");
    return;
  }

  if (deadline === "") {
    alert("Deadline harus diisi.");
    return;
  }

  const newTask = {
    title: title,
    deadline: deadline,
    completed: false
  };

  tasks.push(newTask);

  taskTitleInput.value = "";
  taskDeadlineInput.value = "";

  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  const confirmDelete = confirm("Yakin mau hapus tugas ini?");

  if (confirmDelete) {
    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
  }
}

function saveNote() {
  const note = dailyNote.value.trim();

  if (note === "") {
    alert("Catatan masih kosong.");
    return;
  }

  localStorage.setItem("dailyNote", note);
  alert("Catatan berhasil disimpan.");
}

function loadNote() {
  const savedNote = localStorage.getItem("dailyNote");

  if (savedNote) {
    dailyNote.value = savedNote;
  }
}

showTaskFormBtn.addEventListener("click", function () {
  taskForm.classList.toggle("active");
});

addTaskBtn.addEventListener("click", addTask);

taskTitleInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

saveNoteBtn.addEventListener("click", saveNote);

window.addEventListener("load", function () {
  loadNote();
  renderTasks();
});