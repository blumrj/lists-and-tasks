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
                html += renderList(list._id, list.name)
                renderModal(list._id, list.name)
            });
            listsContainer.innerHTML = html
        }
    } catch (error) {
        console.log(error)
    }
}
showAllLists()

function renderList(id, name){
    var html = `<div class='col'>
    <div class="card h-100">
        <div class="card-header" id="list-${id}">
            <div class="row justify-content-between mx-0 px-0">
                <p class='col-auto mb-0 px-0' ondblclick="editList('${id}')">${name}</p>
                <span class='col-auto'>
                <i class="bi bi-plus-circle addBtn"></i>
                <i class="bi bi-pen editBtn" onclick="editList('${id}')"></i>
                <i class="bi bi-trash3 deleteBtn" data-bs-toggle="modal" data-bs-target="#modal-${id}"></i>
                </span>
            </div>

            <div id="tb-edit-list-${id}" class="input-group input-group-sm d-none">
                <input class="form-control form-control-sm " type="text" value='${name}' onkeydown="enterChanges('${id}', event)" maxlength="20"/>
                <input type="button" value="Apply" class="btn btn-primary" id="btn-edit-list-${id}">
            </div>

        </div>
        <div class="card-body">
        <h6 class="card-subtitle">This list is empty</h6>
        </div>
    </div>
</div>`

return html
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
        var tbEditList = document.querySelector(`#tb-edit-list-${id}`)
        var btnEditList = document.querySelector(`#btn-edit-list-${id}`)
        
        listTitle.parentElement.classList.add("d-none")
        tbEditList.classList.remove("d-none")
        
        //when clicked on apply button
        btnEditList.addEventListener("click", async () => {
            var originalListName = listTitle.innerHTML
            var updatedListName = tbEditList.firstElementChild.value 

            if((originalListName != updatedListName) && (updatedListName != '')){
                var listID = id;
                var updatedList = {"name": updatedListName}
                await axios.patch(`/api/v1/lists/${listID}`, updatedList)
                showAllLists()
            }

            listTitle.parentElement.classList.remove("d-none")
            tbEditList.classList.add("d-none")
        })

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



