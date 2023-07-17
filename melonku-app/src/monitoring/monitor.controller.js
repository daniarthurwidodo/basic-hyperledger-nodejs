require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const router = Router(); // create router to create route bundle
const Temp = require("./monitor.model")

router.post("/:source/:deviceID", async (req, res) => {
    try {
        let body = req.body
        body.sourceGudang = req.params.source;
        body.deviceID =  req.params.deviceID;
        await Temp.create(body)
        res.status(200).send({
            data: body
        })
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;