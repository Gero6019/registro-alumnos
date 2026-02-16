const {Router} = require("express");
const db = require("../db.js");
const auth = require("../middleware/auth.js")
const router = Router();

router.use(auth);

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
    const stmt = db.prepare(`INSERT INTO asistencias (alumno_id, profesor_id, fecha, presente) VALUES (?, ?, ?, ?)`);
    const professor_id = req.session.userId

    const transaction = db.transaction((list) => {
        for (const e of list) {
            stmt.run(e.alumno_id, professor_id, fecha, e.asistencia);
        }
    });

    try {
        transaction(alumnos);
        res.json({ ok: true });
    } catch (error) {
        res.status(400).json({ error });
    }
})

module.exports = router;