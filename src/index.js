const express = require("express");
const { PORT, SECRET, path, dirPath } = require("../config.js");
const session = require("express-session");
const asistencias = require("./routes/asistencias.routes.js");
const alumnos = require("./routes/alumnos.routes.js");
const login = require("./routes/login.routes.js");
const pages = require("./routes/pages.routes.js");

const app = express();

app.use(express.json());
app.use(session({
    name:"asistencia.sid",
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly:true,
        secure:false
    }
}));
app.use(express.static(path.join(dirPath,'public')));

app.use("/",pages);
app.use("/api/login",login);
app.use("/api/alumnos",alumnos);
app.use("/api/asistencias",asistencias);

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});