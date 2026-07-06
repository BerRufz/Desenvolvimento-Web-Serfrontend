(function () {
  "use strict";

  //ARMAZENAR O DOM EM VARIÁVEIS
  const itemInput = document.getElementById("item-input");
  const todoAddForm = document.getElementById("todo-add");
  const ul = document.getElementById("todo-list");
  // const lis = ul.getElementsByTagName("li");

  let arrTasks = getSavedData();

  // function addEventLi(li) {
  //   li.addEventListener("click", function () {
  //     console.log(this);
  //   });
  // }

  function getSavedData() {
    let tasksData = localStorage.getItem("tasks");
    tasksData = JSON.parse(tasksData); // Faz com que o array seja convertido em objeto

    return tasksData && tasksData.length ? tasksData : [];
  }

  function setNewData() {
    localStorage.setItem("tasks", JSON.stringify(arrTasks)); // Faz com que o array seja convertido em string
  }

  setNewData();

  function generateLiTask(obj) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const checkButton = document.createElement("button");
    const editButton = document.createElement("i");
    const deleteButton = document.createElement("i");

    li.className = "todo-item"; // <li class="todo-item"> </li>

    checkButton.className = "button-check";
    checkButton.innerHTML = `<i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkButton"></i>`;
    checkButton.setAttribute("data-action", "checkButton"); // <button class="button-check" data-action="checkButton"> <i class="fas fa-check displayNone"></i> </button>

    li.appendChild(checkButton);

    p.className = "task-name"; // <p class="task-name"> </p>
    p.textContent = obj.name; // <p> </p>
    li.appendChild(p); // <li> <p> </p> </li>

    editButton.className = "fas fa-edit";
    editButton.setAttribute("data-action", "editButton"); // <i class="fas fa-edit" data-action="editButton"> </i>
    li.appendChild(editButton);

    const containerEdit = document.createElement("div");
    containerEdit.className = "editContainer";
    const inputEdit = document.createElement("input");
    inputEdit.setAttribute("type", "text");
    inputEdit.className = "editInput";
    inputEdit.value = obj.name;

    containerEdit.appendChild(inputEdit);
    const containerEditButton = document.createElement("button");
    containerEditButton.className = "editButton";
    containerEditButton.textContent = "Edit";
    containerEditButton.setAttribute("data-action", "confirmEdit"); // <button class="editButton" data-action="confirmEdit">Edit</button>
    containerEdit.appendChild(containerEditButton);

    // Fazendo o appendChild do containerEditButton dentro do containerEdit

    const containerCancelButton = document.createElement("button");
    containerCancelButton.className = "cancelButton";
    containerCancelButton.textContent = "Cancel";
    containerCancelButton.setAttribute("data-action", "cancelButton"); // <button class="cancelButton" data-action="cancelButton">Cancel</button>
    containerEdit.appendChild(containerCancelButton);

    // Fazendo o appendChild do containerCancelButton dentro do containerEdit

    li.appendChild(containerEdit);

    deleteButton.className = "fas fa-trash-alt";
    deleteButton.setAttribute("data-action", "deleteButton"); // <i class="fas fa-trash-alt" data-action="deleteButton"> </i>
    li.appendChild(deleteButton);

    // addEventLi(li);
    return li;
  }

  function renderTasks() {
    ul.innerHTML = "";
    arrTasks.forEach((task) => {
      ul.appendChild(generateLiTask(task));
    });
  }

  function addTask(task) {
    arrTasks.push({
      name: task,
      createdAt: Date.now(),
      completed: false,
    });

    setNewData();
  }

  function clickedUl(e) {
    const dataAction = e.target.getAttribute("data-action");
    if (!dataAction) return;

    let currentLi = e.target;

    while (currentLi.nodeName !== "LI") {
      currentLi = currentLi.parentElement;
    }

    const currentLiIndex = [...ul.querySelectorAll("li")].indexOf(currentLi);

    // if (e.target.className === "fas fa-check") {
    // if (e.target.classList.contains("fa-edit")) {
    // if (e.target.getAttribute("data-action") === "editButton") {
    //   console.log("check");
    // } else if (e.target.getAttribute("data-action") === "cancelButton") {
    // }
    // switch (e.target.getAttribute("data-action")) {
    //   case "editButton":
    //     console.log("É edit no switch");
    //     break;
    //   default:
    //     console.log("Não é edit");
    // }

    const actions = {
      editButton: function () {
        const editContainer = currentLi.querySelector(".editContainer");

        ul.querySelectorAll(".editContainer").forEach((container) => {
          container.removeAttribute("style");
        });

        editContainer.style.display = "flex";
      },

      confirmEdit: function () {
        const val = currentLi.querySelector(".editInput").value;

        arrTasks[currentLiIndex].name = val;

        renderTasks(); // Atualiza a lista de tarefas na tela
        setNewData();
      },

      cancelButton: function () {
        currentLi.querySelector(".editContainer").removeAttribute("style");

        currentLi.querySelector(".editInput").value =
          arrTasks[currentLiIndex].name;
      },

      deleteButton: function () {
        arrTasks.splice(currentLiIndex, 1);

        renderTasks(); // Atualiza a lista de tarefas na tela
        setNewData();
      },

      checkButton: function () {
        arrTasks[currentLiIndex].completed =
          !arrTasks[currentLiIndex].completed;

        setNewData();
        renderTasks(); // Atualiza a lista de tarefas na tela
      },
    };

    if (actions[dataAction]) {
      actions[dataAction]();
    }
  }

  todoAddForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!itemInput.value.trim()) return;

    addTask(itemInput.value);

    renderTasks();

    itemInput.value = "";
    itemInput.focus();
  });

  ul.addEventListener("click", clickedUl);

  renderTasks(); // Atualiza a lista de tarefas na tela
})();
