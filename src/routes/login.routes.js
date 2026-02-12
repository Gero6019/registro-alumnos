const Router = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db.js");
const delay = require("../middleware/delay.js");
const router = Router();

router.post("/",delay,(req,res)=>{
    const {name, password} = req.body;
    const user = db.prepare("SELECT * FROM usuarios WHERE name = ?").get(name);
    if(!user) return res.status(401).json({status:"Error", message:"Credenciales incorrectas."});
    
    const ok = bcrypt.compareSync(password,user.password);
    if(!ok) return res.status(401).json({status:"Error",message:"Credenciales incorrectas."});
    req.session.userId = user.id;
    res.json({ok:true,redirect:"/alumnos"});
})

router.post("/logout",(req,res)=>{
    req.session.destroy(()=>{res.json({ok:true})});
})

module.exports = router;