require("dotenv").config(); // load .env variables
const { Router } = require("express");

const router = Router();

router.get("/melon", (req, res) => {
    try {

        res.status(200).json({message : "Hi mom!"})

    } catch (error) {

        res.status(400).json({ error })
    }

})

router.post("/melon", (req, res) => {
    try {
        

        res.status(200).json({message : "Hi mom!"})

    } catch (error) {

        res.status(400).json({ error })
    }

})

module.exports = router