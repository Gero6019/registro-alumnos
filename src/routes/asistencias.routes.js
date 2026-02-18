const {Router} = require("express");
const db = require("../db.js");
const auth = require("../middleware/auth.js")
const router = Router();

router.use(auth);

const transaction = db.transaction((list,stmt,data) => {
        for (const e of list) {
            stmt.run(e.alumno_id, data.professor_id, data.fecha, e.asistencia);
        }
});

router.get("/",(req,res)=>{
    const { fecha } = req.query;
    const data = db.prepare(`SELECT 
        alumnos.id, 
        alumnos.nombre, 
        asistencias.presente 
        FROM alumnos
        JOIN asistencias ON asistencias.alumno_id = alumnos.id
        WHERE fecha = ?`).all(fecha);

    res.json(data);
})

router.post("/",(req,res)=>{
    const { alumnos, fecha } = req.body;
    const checkDate = db.prepare('SELECT * FROM asistencias WHERE fecha = ?').all(fecha);

    if(checkDate.length !== 0){
        return res.status(401).json({status:"Error",error:"Fecha ya existente."});
    }
    
    const stmt = db.prepare(`INSERT INTO asistencias (alumno_id, profesor_id, fecha, presente) VALUES (?, ?, ?, ?)`);
    const professor_id = req.session.userId;

    try {
        transaction(alumnos,stmt,{professor_id,fecha});
        res.json({ ok: true });
    } catch (error) {
        res.status(400).json({ error });
    }
})

router.put("/",(req,res)=>{
    const {alumno_id,asistencia, fecha} = req.body;
    try {
        db.prepare('UPDATE asistencias SET presente = ? WHERE alumno_id = ? AND fecha = ?;').run(asistencia,alumno_id,fecha);
        res.json({ok:true});
    } catch (error) {
        res.status(400).json({error});
    }
})

module.exports = router;