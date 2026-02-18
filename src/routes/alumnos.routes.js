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
    if(!nombre || typeof nombre !== "string") return res.status(400).json({status:"Error", message:"Datos invalidos."});

    try {
        const stmt = db.prepare("INSERT INTO alumnos (nombre) VALUES (?)");
        const info = stmt.run(nombre);
        res.json({ ok:true,id: info.lastInsertRowid, nombre });
    } catch (error) {
        console.error(error);
        res.json(500).json({error});
    }
})

router.put("/",(req,res)=>{
    const { id,nombre } = req.body;
    if(!id || typeof id !== "number") return res.status(400).json({status:"Error", message:"Datos invalidos."});
    if(!nombre || typeof nombre !== "string") return res.status(400).json({status:"Error", message:"Datos invalidos."});

    try {
        db.prepare("UPDATE alumnos SET nombre = ? WHERE id = ?").run(nombre,id);
        res.json({ok:true});   
    } catch (error) {
        console.error(error);
        res.status(500).json({status:"Error",message:"Error al actualizar almuno."});
    }
})

router.delete("/",(req,res)=>{
    const {id} = req.body;
    if(!id || typeof id !== "number") return res.status(400).json({status:"Error", message:"Datos invalidos."});

    try {
        db.prepare("UPDATE alumnos SET activo = 0 WHERE id = ?").run(id);
        res.json({ok:true});
    } catch (error) {
        console.error(error);
        res.status(500).json({status:"Error",message:"Error al eliminar alumno",error})
    }
})

module.exports = router;