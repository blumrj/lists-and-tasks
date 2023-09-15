var listsContainer = document.querySelector(".lists")
var btnCreateList = document.querySelector("#btnCreateList")
var tbCreateList = document.querySelector("#tbCreateList")



const showAllLists = async () => {
    try {
        const {data: {lists}} = await axios.get("/api/v1/lists")
        if(lists.length){
            var html = ''
            lists.forEach(list => {
                html += `
                <div class='col'>
                    <div class="card h-100">
                        <div class="card-header row justify-content-between mx-0">
                            ${list.name} 
                            <span class='col-auto'>
                            <i class="bi bi-plus-circle addBtn"></i>
                            <i class="bi bi-pen editBtn"></i>
                            <i class="bi bi-trash3 deleteBtn" data-bs-toggle="modal" data-bs-target="#backdropModal"></i>
                            </span>
                        </div>
                        <div class="card-body">
                        <h6 class="card-subtitle">This list is empty</h6>

                        </div>
                    </div>
                </div>`
            });
            listsContainer.innerHTML = html
        }
    } catch (error) {
        console.log(error)
    }
}
showAllLists()

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

btnCreateList.addEventListener("click", () => {
    createList()
})

function renderModal(){
    var html = `<div class="modal fade" id="backdropModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            Are you sure you want to delete this list?
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary">Yes</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>`
}

var deleteBtns = document.querySelector(".card")
console.log(deleteBtns);


