const mongoose = require("mongoose")
const {Schema} = mongoose

const ListSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    }
})

// ListSchema.virtual("tasks", {
//     ref: "Task", 
//     localField: '_id',
//     foreignField: "list"
// })


module.exports = mongoose.model("List", ListSchema)