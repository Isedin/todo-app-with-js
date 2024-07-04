const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

/*Create a taskData constant and set it to an empty array. This array will store all the tasks along with their associated data, including title, due date, and description. This storage will enable you to keep track of tasks, display them on the page, and save them to localStorage.*/

// Set taskData to the retrieval of data from local storage or an empty array. Make sure you parse the data coming with JSON.parse() because you saved it as a string.
const taskData = JSON.parse(localStorage.getItem("data")) || [];
/*Use let to create a currentTask variable and set it to an empty object. This variable will be used to track the state when editing and discarding tasks.*/
let currentTask = {};

const addOrUpdateTask = () => {
	const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

	const taskObj = {
		/*Inside your taskObj, add an id property name. For the value use the value of the titleInput.*/
		id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
		/*Add a title property to taskObj and set it to the value of titleInput.*/
		title: titleInput.value,
		/*Add a date property to taskObj and set it to the value of dateInput.*/
		date: dateInput.value,
		/*Add a description property to taskObj and set it to the value of descriptionInput.*/
		description: descriptionInput.value,
	};
	/*Create an if statement with the condition dataArrIndex === -1. Within the if statement, use the unshift() method to add the taskObj object to the beginning of the taskData array.
    unshift() is an array method that is used to add one or more elements to the beginning of an array.*/
	if (dataArrIndex === -1) {
		taskData.unshift(taskObj);
	} else {
		taskData[dataArrIndex] = taskObj;
	}

	localStorage.setItem("data", JSON.stringify(taskData));

	updateTaskContainer();
	reset();
};

const updateTaskContainer = () => {
	/*ovdje idpod smo popravili kod na osnovu koraka br. 40*/
	tasksContainer.innerHTML = "";
	/*Use const to declare a variable called dataArrIndex and assign it the value of taskData.findIndex(). For the findIndex() method, pass in an arrow function with item as the parameter.
    Within the arrow function, check if the id property of item is strictly equal to the id property of currentTask.*/
	/*Use forEach() on taskData, then destructure id, title, date, description as the parameters.*/
	taskData.forEach(({ id, title, date, description }) => {
		tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
        `;
	});
};

const deleteTask = (buttonEl) => {
	const dataArrIndex = taskData.findIndex(
		(item) => item.id === buttonEl.parentElement.id
	);
	buttonEl.parentElement.remove();
	taskData.splice(dataArrIndex, 1);
	/*You also want a deleted task to be removed from local storage. For this, you don't need the removeItem() or clear() methods. Since you already use splice() to remove the deleted task from taskData, all you need to do now is save taskData to local storage again.
Use setItem() to save the taskData array again. Pass in data as the key and ensure that taskData is stringified before saving.*/
	localStorage.setItem("data", JSON.stringify(taskData));
};

const editTask = (buttonEl) => {
	const dataArrIndex = taskData.findIndex(
		(item) => item.id === buttonEl.parentElement.id
	);
	currentTask = taskData[dataArrIndex];
	titleInput.value = currentTask.title;
	dateInput.value = currentTask.date;
	descriptionInput.value = currentTask.description;
	addOrUpdateTaskBtn.innerText = "Update Task";
	taskForm.classList.toggle("hidden");
};

const reset = () => {
	//     If you try to add a new task, edit that task, and then click on the Add New Task button, you will notice a bug.
	// The form button will display the incorrect text of "Update Task" instead of "Add Task". To fix this, you will need to assign the string "Add Task" to addOrUpdateTaskBtn.innerText inside your reset function.
	addOrUpdateTaskBtn.innerText = "Add Task";
	/*Inside the reset function, set each value of titleInput, dateInput, descriptionInput to an empty string.*/
	titleInput.value = "";
	dateInput.value = "";
	descriptionInput.value = "";
	taskForm.classList.toggle("hidden");
	currentTask = {};
};

// Check if there's a task inside taskData, then call the updateTaskContainer() inside the if statement block.
if (taskData.length) {
	updateTaskContainer();
}

/*Add an event listener to the openTaskFormBtn element and pass in a click event for the first argument and an empty callback function for the second argument.
For the callback function, use the classList.toggle() method to toggle the hidden class on the taskForm element.*/
openTaskFormBtn.addEventListener("click", () => {
	taskForm.classList.toggle("hidden");
});

/*Add an event listener to the closeTaskFormBtn variable and pass in a click event for the first argument and a callback function for the second argument.
For the callback function, call the showModal() method on the confirmCloseDialog element. This will display a modal with the Discard and Cancel buttons.*/
closeTaskFormBtn.addEventListener("click", () => {
	// confirmCloseDialog.showModal();

	/*within the closeTaskFormBtn event listener, create a formInputsContainValues variable to check if there is a value in the titleInput field or the dateInput field or the descriptionInput field.*/
	const formInputsContainValues =
		titleInput.value || dateInput.value || descriptionInput.value;
	const formInputValuesUpdated =
		titleInput.value !== currentTask.title ||
		dateInput.value !== currentTask.date ||
		descriptionInput.value !== currentTask.description;
	// formInputsContainValues && formInputValuesUpdated
	// 	? confirmCloseDialog.showModal()
	// 	: reset();
	if (formInputsContainValues && formInputValuesUpdated) {
		confirmCloseDialog.showModal();
	} else {
		reset();
	}
});

/*Add an event listener to the cancelBtn element and pass in a click event for the first argument and a callback function for the second argument.
For the callback function, call the close() method on the confirmCloseDialog element.*/
cancelBtn.addEventListener("click", () => {
	confirmCloseDialog.close();
});

/*If the user clicks the Discard button, you want to close the modal showing the Cancel and Discard buttons, then hide the form modal.
Add a click event listener to discardBtn, then use the close() method on the confirmCloseDialog variable. Also, use classList to toggle the class hidden on taskForm so the form modal will close too.*/
discardBtn.addEventListener("click", () => {
	confirmCloseDialog.close();
	// taskForm.classList.toggle("hidden"); ovo cemo napisati drugacije:
	reset();
});

/*To start, add a submit event listener to your taskForm element and pass in e as the parameter of your arrow function. Inside the curly braces, use the preventDefault() method to stop the browser from refreshing the page after submitting the form.*/
taskForm.addEventListener("submit", (e) => {
	e.preventDefault();
	// taskForm.classList.toggle("hidden"); ovo cemo napisati drugacije:
	addOrUpdateTask();
});

/* primjer kako se shranjuje u lokalnu memoriju a zatim brise*/
// sve cemo zakomentirati jer cemo koristiti drugi nacin za cuvanje podataka u lokalnoj memoriji
// const myTaskArr = [
// 	{ task: "Walk the Dog", date: "22-04-2022" },
// 	{ task: "Read some books", date: "02-11-2023" },
// 	{ task: "Watch football", date: "10-08-2021" },
// ];

// localStorage.setItem("data", JSON.stringify(myTaskArr));

/*Now that you have the myTaskArr array saved in localStorage correctly, you can retrieve it with getItem() by specifying the key you used to save the item.
Use the getItem() method to retrieve the myTaskArr array and assign it to the variable getTaskArr.*/
// const getTaskArr = localStorage.getItem("data");
// console.log(getTaskArr);

// const getTaskArrObj = JSON.parse(localStorage.getItem("data"));
// console.log(getTaskArrObj);

/*Remove the data item from local storage and open the console to observe the result. You should see null.*/
// localStorage.removeItem("data");

/*To clear all items from local storage, use the clear() method on localStorage.*/
// localStorage.clear();
