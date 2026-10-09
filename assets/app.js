(function () {
  const listEl = document.getElementById("task-list");
  const resetButton = document.getElementById("reset-tasks");
  const progressEl = document.getElementById("task-progress");
  if (!listEl) return;

  const STORAGE_KEY = "daily-ops-blog-tasks-v1";

  async function loadTasks() {
    const response = await fetch("assets/tasks.json");
    if (!response.ok) throw new Error("tasks unavailable");
    return response.json();
  }

  function savedDone() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? new Set(value) : new Set();
    } catch (error) {
      return new Set();
    }
  }

  function render(tasks, doneIds) {
    listEl.textContent = "";
    tasks.forEach(function (task) {
      const item = document.createElement("label");
      item.className = "task" + (doneIds.has(task.id) ? " done" : "");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = doneIds.has(task.id);
      input.setAttribute("aria-label", "Mark done: " + task.title);
      input.addEventListener("change", function () {
        if (input.checked) {
          doneIds.add(task.id);
        } else {
          doneIds.delete(task.id);
        }
        persist(doneIds);
        render(tasks, doneIds);
      });

      const body = document.createElement("span");
      const title = document.createElement("h3");
      title.textContent = task.title;
      const note = document.createElement("p");
      note.textContent = task.note;
      body.append(title, note);

      const time = document.createElement("span");
      time.className = "time";
      time.textContent = task.time || "Anytime";

      item.append(input, body, time);
      listEl.append(item);
    });
    updateProgress(tasks, doneIds);
  }

  function updateProgress(tasks, doneIds) {
    if (!progressEl) return;
    let completed = 0;
    tasks.forEach(function (task) {
      if (doneIds.has(task.id)) completed += 1;
    });
    progressEl.textContent = completed + " of " + tasks.length + " done";
  }

  function persist(doneIds) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(doneIds)));
  }

  resetButton.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEY);
    listEl.innerHTML = '<p class="loading">Loading tasks...</p>';
    init();
  });

  async function init() {
    const doneIds = savedDone();
    try {
      const tasks = await loadTasks();
      render(tasks, doneIds);
    } catch (error) {
      listEl.innerHTML = '<p class="loading">Tasks are unavailable right now.</p>';
    }
  }

  init();
})();