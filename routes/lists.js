const express = require("express")
const router = express.Router();
const {getAllLists, createList, updateList, deleteList} = require("../controllers/lists")

router
.route("/")
.get(getAllLists)
.post(createList)

router
.route("/:id")
.patch(updateList)
.delete(deleteList)


module.exports = router