// for starting the json-server fire the following command:
// :=> json-server db.json

const BASE_API_URL = "http://localhost:3000/tasks";

// getting the tableElement from DOM
const tableElement = document.querySelector("#tasks-table");

// for listing the tasks
function getTasks(filter) {
  let parameter = "";

  if (filter === "completed") {
    parameter = "?completed=true";
  } else if (filter === "active") {
    parameter = "?completed=false";
  }

  const API_URL = BASE_API_URL + parameter;
  fetch(API_URL)
    .then((response) => response.json())
    .then((tasks) => {
      let tableRows = "";
      tasks.forEach((task) => {
        const element = `<tr class=${
          task.completed ? "table-success" : ""
        }><td><input class="form-check-input" type="checkbox" ${
          task.completed ? "checked" : ""
        } onclick="toggleTask(event, ${task.id})"></td><td>${
          task.title
        }</td><td><button type="button" class="btn btn-link" onclick="editTask(${
          task.id
        })">Edit</button></td><td><button type="button" class="btn btn-link" onclick="deleteTask(${
          task.id
        })">Delete</button></td></tr>`;

        // attaching/concatenating the individual-table-rows to
        // tableRows combine as list-of-all-rows
        tableRows += element;
      });
      // finally add to tbody tag
      tableElement.innerHTML = tableRows;
    });
}

// function calling
getTasks();

// Add New Task :: POST-REQUEST
function addTask() {
  // 4-digit id
  const id = Math.floor(1000 + Math.random() * 9000).toString();
  const taskTitle = document.querySelector("#task-title");
  const data = {
    id: id,
    title: taskTitle.value,
    completed: false,
  };
  fetch(BASE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      alert("Task Added Successfully");
      getTasks();
      taskTitle.value = "";
    }
  });
}

// Delete the Task :: DELETE-REQUEST
function deleteTask(id) {
  console.log(`id > ${id}`);
  const confirmation = confirm("Are you sure you want to delete the task?");
  if (confirmation) {
    fetch(BASE_API_URL + "/" + id, {
      method: "DELETE",
    }).then((respose) => {
      if (respose.ok) {
        alert("Task Deleted Successfully");
        getTasks();
      }
    });
  }
}

// Edit the Task :: PATCH-REQUEST
function editTask(id) {
  console.log(`id > ${id}`);
  const newTitle = prompt("Enter the new Task Title:");
  if (newTitle) {
    const data = { title: newTitle };
    fetch(BASE_API_URL + "/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        alert("Task Updated.!");
        getTasks();
      }
    });
  }
}

// Toggle the Task :: PATCH-REQUEST
function toggleTask(event, id) {
  const checked = event.target.checked;
  const data = {
    completed: checked,
  };
  fetch(BASE_API_URL + "/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "appliation/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok && checked) {
      alert("Hurray!, You finished the task");
    }
    getTasks();
  });
}

// Filter the Task :: GET-REQUEST:(Query-Params)
function filterTasks(event) {
  const filterValue = event.target.value;
  if (filterValue === "all") {
    getTasks();
  } else if (filterValue === "completed") {
    getTasks("completed");
  } else {
    getTasks("active");
  }
}
