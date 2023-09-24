var listsContainer = document.querySelector(".lists")
var btnCreateList = document.querySelector("#btnCreateList")
var tbCreateList = document.querySelector("#tbCreateList")
var modalsDiv = document.querySelector("#modals")


const showAllLists = async () => {
    try {
        const {data: {lists}} = await axios.get("/api/v1/lists")
        if(lists.length){
            var html = ''
            lists.forEach(list => {
                html += renderList(list._id, list.name, list.tasks)
                renderModal(list._id, list.name)
            });
            listsContainer.innerHTML = html
        }
    } catch (error) {
        console.log(error)
    }
}
showAllLists()

function renderList(id, name, tasks){
    var ifTasks = tasks.length ? true : false;

    var html = `<div class='col'>
    <div class="card h-100">
        <div class="card-header" id="list-${id}">
            <div id="list-header-${id}" class="row justify-content-between mx-0 px-0">
                <p class='col-auto mb-0 px-0' ondblclick="editList('${id}')">${name}</p>
                <span class='col-auto'>
                <i class="icon bi bi-plus-circle addBtn" data-searchbar="searchbar-create-task-${id}" onclick="showSearchBar(this)"></i>
                <i class="icon bi bi-pen editBtn" data-searchbar="searchbar-edit-list-${id}" onclick="showSearchBar(this)"></i>
                <i class="icon bi bi-trash3 deleteBtn" data-bs-toggle="modal" data-bs-target="#modal-${id}"></i>
                </span>
            </div>

            <div id="searchbar-edit-list-${id}" class="input-group input-group-sm d-none">
                <input type="text" id='tb-edit-list-${id}' class="form-control form-control-sm " value='${name}' onkeydown="enterChanges('${id}', event)" maxlength="20"/>
                <input type="button" id="btn-edit-list-${id}" class="btn btn-primary" value="Apply" for-tb-input="tb-edit-list-${id}" onclick="editList('${id}')">
            </div>

            <div id="searchbar-create-task-${id}" class="input-group input-group-sm d-none">
                <input class="form-control form-control-sm " type="text" onkeydown="enterChanges('${id}', event)" maxlength="20" placeholder='Add new task...'/>
                <input type="button" value="Create" class="btn btn-primary" id="btn-add-task-${id}" onclick="createTask('${id}')">
            </div>
        </div>
        <div class="card-body">`

    if(!ifTasks){
        html += `<h6 class="card-subtitle">This list is empty</h6>`
    }
    else{
        tasks.forEach(task => {
            html += renderTasks(task)
        })
    }

    html += `</div></div></div>`

return html
}


function renderTasks(task){
    var isChecked = task.isCompleted
    var html = `<div class='row justify-content-between mx-0 px-0'>`

    if(isChecked){
        html += `
        <div class="form-check col-auto">
            <input class="form-check-input task" type="checkbox" value="${task._id}" id="task-${task._id}" onchange="isCompleted(this), editTask(this, ${isChecked})" checked>
            <label class="form-check-label completed-task" for="task-${task._id}">
            ${task.title}
            </label>
        </div>`
    }
    else {
        html += `
        <div class="form-check col-auto">
            <input class="form-check-input task" type="checkbox" value="${task._id}" id="task-${task._id}" onchange="editTask(this, ${isChecked}), isCompleted(this)">
            <label class="form-check-label" for="task-${task._id}">
            ${task.title}
            </label>
        </div>`
    }

    html += `
        <span class='col-auto'>
            <i class="icon bi bi-pen editBtn"></i>
            <i class="icon bi bi-trash3 deleteBtn" data-bs-toggle="modal"></i>
        </span>
    </div>`

    return html
}

function showSearchBar(element) {
    console.log(element.dataset.searchbar);

    var searchbarId = element.dataset.searchbar;
    var listID = searchbarId.split("-").pop()
    console.log(listID);
    var searchbarArrayId = ["list-header-" + listID, "searchbar-edit-list-" + listID, "searchbar-create-task-" + listID]

    searchbarArrayId.forEach(id => {
        console.log(id);
        if(id != searchbarId){
            console.log("razlicito");
            document.querySelector(`#${id}`).classList.add("d-none")
            return
        }

        document.querySelector(`#${searchbarId}`).classList.remove("d-none")
    })

}

function isCompleted(task){
    if(task.checked){
        task.nextElementSibling.classList.add("completed-task")
    }
    else{
        task.nextElementSibling.classList.remove("completed-task")
    }
}

const createList = async () => {
    try {
        var newListName = tbCreateList.value
        var newList = {"name": newListName}
        await axios.post("/api/v1/lists", newList)
        showAllLists()
        document.querySelector("#tbCreateList").value=''
    } catch (error) {
        console.log(error);
    }
}

const deleteList = async (id) => {
    try {
        var listID = id
        await axios.delete(`/api/v1/lists/${listID}`)
        showAllLists()
    } catch (error) {
        console.log(error);
    }
}

const editList = async (id) => {
    try {
        var listTitle = document.querySelector(`#list-${id} p`)
        var editListSearchbar = document.querySelector(`#tb-edit-list-${id}`)
        
        var originalListName = listTitle.innerHTML
        var updatedListName = editListSearchbar.value 

        console.log(originalListName, updatedListName);

        if((originalListName != updatedListName) && (updatedListName != '')){
            var listID = id;
            var updatedList = {"name": updatedListName}
            await axios.patch(`/api/v1/lists/${listID}`, updatedList)
            showAllLists()
        }

    } catch (error) {
        console.log(error);
    }
}

const createTask = async (id) => {
    try {
        console.log(id);
        var newTask = {
            "title": "New task",
            "list": id
        }
        await axios.post("api/v1/tasks", newTask)
        showAllLists()
    } catch (error) {
        console.log(error);
    }
}

const editTask = async (task, originalTaskState) => {
    try {
        var updatedTaskState = task.checked

        if(originalTaskState != updatedTaskState){
            var taskID = task.value;
            var updatedTask = {"isCompleted": updatedTaskState}
            await axios.patch(`/api/v1/tasks/${taskID}`, updatedTask)
            showAllLists()
        }
    } catch (error) {
        console.log(error);
    }
}

btnCreateList.addEventListener("click", () => {
    createList()
})

function enterChanges(id, event){
    if (event.key === "Enter") {
        document.querySelector(`#btn-edit-list-${id}`).click();
    }
}

function renderModal(id, name){
    var html = `<div class="modal fade" id="modal-${id}" tabindex="-1" aria-labelledby="modal-${id}-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal-${id}-label">Confirm your action</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            Are you sure you want to delete ${name}?
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick="deleteList('${id}')" data-bs-dismiss="modal">Yes</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>`

  modalsDiv.innerHTML += html
}



