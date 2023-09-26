var listsContainer = document.querySelector(".lists")
var btnCreateList = document.querySelector("#btnCreateList")
var tbCreateList = document.querySelector("#tbCreateList")
var modalsDiv = document.querySelector("#modals")


const showAllLists = async () => {
    try {
        const {data: {lists, message}} = await axios.get("/api/v1/lists")
        var html = ''
        if(!lists){
            html += `<h3 class="w-auto m-auto text-black-50 text-center">${message}</h3>`
        }
        else{
            lists.forEach(list => {
                html += renderList(list._id, list.name, list.tasks)
                renderModal(list._id, "list", "deleteList")
            });
        }

        listsContainer.innerHTML = html

    } catch (error) {
        console.log(error)
    }
}
showAllLists()

function renderList(id, name, tasks){
    var ifTasks = tasks.length ? true : false;

    var html = `<div class='col'>
    <div class="card h-100">
        <div class="card-header bg-dark text-white" id="list-${id}">
            <div id="list-header-${id}" class="row justify-content-between mx-0 px-0">
                <p class='col-auto mb-0 px-0' ondblclick="editList('${id}')">${name}</p>
                <span class='col-auto'>
                <i class="icon bi bi-plus-circle addBtn" data-searchbar="searchbar-create-task-${id}" onclick="showSearchBar(this)"></i>
                <i class="icon bi bi-pen editBtn" data-searchbar="searchbar-edit-list-${id}" onclick="showSearchBar(this)"></i>
                <i class="icon bi bi-trash3 deleteBtn" data-bs-toggle="modal" data-bs-target="#modal-${id}"></i>
                </span>
            </div>

            <div id="searchbar-edit-list-${id}" class="input-group input-group-sm d-none">
                <input type="text" id='tb-edit-list-${id}' class="form-control form-control-sm" value='${name}' maxlength="20"/>
                <input type="button" id="btn-edit-list-${id}" class="btn btn-primary" value="Apply" for-tb-input="tb-edit-list-${id}" onclick="editList('${id}')">
            </div>

            <div id="searchbar-create-task-${id}" class="input-group input-group-sm d-none">
                <input type="text" id="tb-create-task-${id}" class="form-control form-control-sm" maxlength="20" placeholder='Add new task...'/>
                <input type="button" id="btn-create-task-${id}" value="Create" class="btn btn-primary" onclick="createTask('${id}')">
            </div>
        </div>
        <div class="card-body bg-dark-subtle">`

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
    var html = `<div id="task-header-${task._id}" class='row justify-content-between mx-0 px-0'>`

    if(isChecked){
        html += `
        <div class="form-check col-auto">
            <input class="form-check-input task" type="checkbox" value="${task._id}" id="task-${task._id}" onchange="isCompleted(this), editTask(this, ${isChecked})" checked>
            <label id="task-label-${task._id}" class="form-check-label completed-task" for="task-${task._id}">
            ${task.title}
            </label>
        </div>`
    }
    else {
        html += `
        <div class="form-check col-auto">
            <input class="form-check-input task" type="checkbox" value="${task._id}" id="task-${task._id}" onchange="editTask(this, ${isChecked}), isCompleted(this)">
            <label id="task-label-${task._id}" class="form-check-label" for="task-${task._id}">
            ${task.title}
            </label>
        </div>`
    }

    html += `
            <span class='col-auto'>
                <i class="icon bi bi-pen editBtn" data-searchbar="searchbar-update-task-${task._id}" onclick="showSearchBar(this)"></i>
                <i class="icon bi bi-trash3 deleteBtn" data-bs-toggle="modal" data-bs-target="#modal-${task._id}"></i>
            </span>
        </div>
        <div id="searchbar-update-task-${task._id}" class="input-group input-group-sm d-none">
            <input type="text" id="tb-update-task-${task._id}" class="form-control form-control-sm" value="${task.title}" maxlength="20"/>
            <input type="button" id="btn-update-task-${task._id}" value="Apply" class="btn btn-primary" onclick="editTaskTitle('${task._id}')">
        </div>`

    renderModal(task._id, "task", "deleteTask")

    return html
}

function showSearchBar(element) {

    var searchbarId = element.dataset.searchbar;
    var id = searchbarId.split("-").pop()
    var searchbarArrayId = ["list-header-" + id, "searchbar-edit-list-" + id, "searchbar-create-task-" + id, "task-header-" + id, "searchbar-update-task-" + id]

    searchbarArrayId.forEach(id => {
        if(id != searchbarId){
            var el = document.querySelector(`#${id}`)
            if(el){
                el.classList.add("d-none")

            }
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
        if(newListName != ''){
            var newList = {"name": newListName}
            await axios.post("/api/v1/lists", newList)
            showAllLists()
            document.querySelector("#tbCreateList").value=''
        }
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

        if((originalListName != updatedListName) && (updatedListName != '')){
            var listID = id;
            var updatedList = {"name": updatedListName}
            await axios.patch(`/api/v1/lists/${listID}`, updatedList)
            showAllLists()
        }
        else{
            document.querySelector(`#list-header-${id}`).classList.remove("d-none")
            editListSearchbar.parentElement.classList.add("d-none")
        }

    } catch (error) {
        console.log(error);
    }
}

const createTask = async (id) => {
    try {
        var createTaskSearchbar = document.querySelector(`#tb-create-task-${id}`)
        
        var newTaskTitle = createTaskSearchbar.value

        if(newTaskTitle != ''){
            var newTask = {
                "title": newTaskTitle,
                "list": id
            }

            await axios.post("api/v1/tasks", newTask)
            showAllLists()
        }
        else{
            document.querySelector(`#list-header-${id}`).classList.remove("d-none")
            createTaskSearchbar.parentElement.classList.add("d-none")
        }

    } catch (error) {
        console.log(error);
    }
}

const deleteTask = async (id) => {
    try {
        var taskID = id
        await axios.delete(`/api/v1/tasks/${taskID}`)
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

const editTaskTitle = async (id) => {
    try {
        var taskTitle = document.querySelector(`#task-label-${id}`)
        var editTaskSearchbar = document.querySelector(`#tb-update-task-${id}`)
        
        var originalTaskTitle = taskTitle.innerHTML.trim()
        var updatedTaskTitle = editTaskSearchbar.value.trim()

        if((originalTaskTitle != updatedTaskTitle) && (updatedTaskTitle != '')){
            var taskID = id;
            var updatedList = {"title": updatedTaskTitle}
            await axios.patch(`/api/v1/tasks/${taskID}`, updatedList)
            showAllLists()
        }
        else{
            taskTitle.parentElement.parentElement.classList.remove("d-none")
            editTaskSearchbar.parentElement.classList.add("d-none")
        }

    } catch (error) {
        console.log(error);
    }
}

btnCreateList.addEventListener("click", () => {
    createList()
})



function renderModal(id, name, functionName){
    var html = `<div class="modal fade" id="modal-${id}" tabindex="-1" aria-labelledby="modal-${id}-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal-${id}-label">Confirm your action</h1>
          <button type="button" class="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            Are you sure you want to delete this ${name}?
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary" onclick="${functionName}('${id}')" data-bs-dismiss="modal">Yes</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>`

  modalsDiv.innerHTML += html
}



