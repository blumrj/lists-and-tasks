const mongoose = require("mongoose")
const {Schema} = mongoose

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 20,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    list: {type: Schema.Types.ObjectId, ref: "List"}   
})

module.exports = mongoose.model("Task", taskSchema)