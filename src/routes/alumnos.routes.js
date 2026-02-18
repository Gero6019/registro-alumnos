const { Router } = require("express");
const db = require("../db.js");
const auth = require("../middleware/auth.js")
const router = Router();

router.use(auth);

router.get("/",(req,res)=>{
    const data = db.prepare("SELECT * FROM alumnos WHERE activo = 1").all();

    res.json(data);
})

router.post("/",(req,res)=>{
    const { nombre } = req.body;
    try {
        const stmt = db.prepare("INSERT INTO alumnos (nombre) VALUES (?)");
        const info = stmt.run(nombre);
        res.json({ ok:true,id: info.lastInsertRowid, nombre });
    } catch (error) {
        res.json(500).json({error})
    }
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

router.delete("/",(req,res)=>{
    const {id} = req.body;
    try {
        db.prepare("UPDATE alumnos SET activo = 0 WHERE id = ?").run(id);
        res.json({ok:true})
    } catch (error) {
        res.status(401).json({status:"Error",message:"Error al eliminar alumno",error})
    }
})

module.exports = router;