const express = require("express")






const router = new express.Router()


router.get('/',(req,res)=>{

    let person = {

        age : 23,
        name:"Nick",
        DOB:"11/15/2000"
    }
res.send(person)
})

module.exports = router;