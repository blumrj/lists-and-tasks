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
        <div class="card-header row justify-content-between mx-0">
            ${name} 
            <span class='col-auto'>
            <i class="bi bi-plus-circle addBtn"></i>
            <i class="bi bi-pen editBtn"></i>
            <i class="bi bi-trash3 deleteBtn" data-bs-toggle="modal" data-bs-target="#modal-${id}"></i>
            </span>
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
    } catch (error) {
        console.log(error);
    }
}

const deleteList = async (id) => {
    // try {
    //     console.log(id);
    //     var listID = id
    //     await axios.delete(`/api/v1/lists/${listID}`)
    //     showAllLists()
    // } catch (error) {
    //     console.log(error);
    // }
    console.log("alo");
}

btnCreateList.addEventListener("click", () => {
    createList()
})

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
        <button type="button" class="btn btn-primary" onclick="deleteList(${id})">Yes</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>`

  modalsDiv.innerHTML += html
}



