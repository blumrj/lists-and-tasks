const notFound = (req,res) => {
    res.status(404).json({message: `The route ${req.route.path} doesn't exist`})
}

module.exports = notFound