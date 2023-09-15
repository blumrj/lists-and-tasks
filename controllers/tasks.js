const Task = require("../models/Task")

const getAllTasks = async (req,res) => {
    try {
        const tasks = await Task.find({})
        if(!tasks.length){
            return res.status(404).json({message: `There are no tasks`})
        }
        res.status(200).json({tasks, NoResults: tasks.length})
    } catch (error) {
        res.status(500).json({message: error})
    }
}
const createTask = async (req,res) => {
    try {
        const task = await Task.create(req.body)
        res.status(201).json({task})
    } catch (error) {
        res.status(500).json({message: error})
    }
}
const getTask = async (req,res) => {
    try {
        const {id:taskID} = req.params
        const task = await Task.findById(taskID)
    if(!task){
        return res.status(404).json({message: `The task with the id ${taskID} doesn't exist.`})
    }
    res.status(200).json({task})
    } catch (error) {
        res.status(500).json({message: error})
    }
    
}
const updateTask = async (req,res) => {
    try {
        const {id:taskID} = req.params
        const task = await Task.findByIdAndUpdate(taskID, req.body, {new:true, runValidators: true})
        if(!task){
            return res.status(404).json({message: `Couldn't update the task with the id ${taskID}`})
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({message: error})
    }
}
const deleteTask = async (req,res) => {
    try {
        const {id:taskID} = req.params
        const task = await Task.findByIdAndDelete(taskID)
        if(!task){
            return res.status(404).json({message: `The task with the id ${taskID} doesn't exist.`})
        }
        res.status(200).json({task})
        
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}