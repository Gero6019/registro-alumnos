const Router = require("express");
const {path, dirPath } = require("../../config.js");
const auth = require("../middleware/auth.js");
const router = Router();

router.get("/",(req,res)=>{
    res.sendFile("index.html");
})

router.get("/alumnos",auth,(req,res)=>{
    res.sendFile(path.join(dirPath,"/public/pages/alumnos.html"));
});

module.exports = router;