const List = require("../models/List")

const getAllLists = async (req,res) => {
    try {
        const lists = await List.find({}).populate("tasks").exec()
        if(!lists.length){
            return res.status(200).json({message: "There are no lists at the moment"})
        }
        res.status(200).json({lists})
    } catch (error) {
        res.status(500).json({message: error})
    }
}
const createList = async (req,res) => {
    try {
        const list = await List.create(req.body)
        res.status(201).json({list})
    } catch (error) {
        res.status(500).json({message: error})
    }
}
const updateList = async (req,res) => {
    try {
        const {id:listID} = req.params
        const list = await List.findByIdAndUpdate(listID, req.body, {new:true, runValidators: true})
        if(!list){
            return res.status(404).json({message: `Couldn't update the list with the id ${listID}`})
        }
        res.status(200).json({list})
    } catch (error) {
        res.status(500).json({message: error})
    }
}
const deleteList = async (req,res) => {
    try {
        const {id:listID} = req.params
        const list = await List.findByIdAndDelete(listID)
        if(!list){
            return res.status(404).json({message: `Couldn't delete the list with the id ${listID}`})
        }
        res.status(200).json({list})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = {
    getAllLists,
    createList,
    updateList,
    deleteList
}