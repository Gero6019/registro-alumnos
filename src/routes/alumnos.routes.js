const { Router } = require("express");
const db = require("../db.js");
const auth = require("../middleware/auth.js")
const router = Router();

router.use(auth);

router.get("/",(req,res)=>{
    const data = db.prepare("SELECT * FROM alumnos").all();

    res.json(data);
})

router.post("/",(req,res)=>{
    const { nombre } = req.body;
    const stmt = db.prepare("INSERT INTO alumnos (nombre) VALUES (?)");
    const info = stmt.run(nombre);
    res.json({ id: info.lastInsertRowid, nombre });
})

router.put("/",(req,res)=>{
    const { id,nombre } = req.body;
    try {
        db.prepare("UPDATE alumnos SET nombre = ? WHERE id = ?").run(nombre,id);
        res.json({ok:true});   
    } catch (error) {
        res.status(401).json({status:"Error",message:"Error al actualizar almuno."});
    }
})

module.exports = router;