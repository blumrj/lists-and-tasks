const mongoose = require("mongoose")
const {Schema} = mongoose

const ListSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    }
},
{
    virtuals: {
        tasks: {
            options: {
                ref: 'Task',
                localField: '_id',
                foreignField: "list"
            }
        }
    }
}
)

ListSchema.set('toObject', { virtuals: true });
ListSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model("List", ListSchema)