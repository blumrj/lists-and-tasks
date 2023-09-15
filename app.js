const express = require("express")
const app = express()
const tasks = require("./routes/tasks")
const lists = require("./routes/lists")
require("dotenv").config()
const connectDB = require("./db/connection")
const notFound = require("./middleware/not-found")

app.use(express.json())
app.use(express.static("./public"))
app.use("/api/v1/tasks", tasks)
app.use("/api/v1/lists", lists)
app.use(notFound)


const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is working on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()
