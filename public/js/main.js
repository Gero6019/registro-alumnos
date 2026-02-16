const studentList = document.getElementById("studentsList");
const asistanceBody = document.getElementById("asistanceBody");
const showAsistanceBody = document.getElementById("showAsistanceBody");

const componentStudentList = (e)=>{
    return`
        <tr data-id="${e.id}" data-name="${e.nombre}">
            <td>${e.id}</td>
            <td>${e.nombre}</td>
            <td><button class="edit-btn">Editar</button></td>
            <td><button class="delete-btn">Eliminar</button></td>
        </tr>
    `
}

const componentAsistanceList = (e)=>{
    return`
        <tr data-asistance-id="${e.id}">
            <td>${e.id}</td>
            <td>${e.nombre}</td>
            <td name="select">
                <select name="asistance">
                    <option value="presente">P</option>
                    <option value="ausente">A</option>
                    <option value="justificado">J</option>
                </select>
            </td>
        </tr>
    `
}

const componentShowAsistance = (e)=>{
    return`
        <tr>
            <td>${e.id}</td>
            <td>${e.nombre}</td>
            <td>${e.presente}</td>
        </tr>
    `
}

const getStudents = async ()=>{
    const res = await fetch("/api/alumnos");
    const data = await res.json();
    return data;
}

const showStudents = async ()=>{
    studentList.innerHTML="";
    const students = await getStudents();
    students.map(e=>{
        studentList.innerHTML += componentStudentList(e);
    });
}

const showStudentsAsistance = async ()=>{
    asistanceBody.innerHTML="";
    const students = await getStudents();
    students.map(e=>{
        asistanceBody.innerHTML+= componentAsistanceList(e);
    });
}

const putStudent = async (event)=>{
    event.preventDefault();
    const id = event.target.children.id;
    const nombre = event.target.children.nuevoNombre;
    const tableName = document.getElementById("student-"+id.value)

    const student ={
        id: id.value,
        nombre: nombre.value
    }

    const res = await fetch("/api/alumnos",{
        method: "PUT",
        credentials: "include",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
    const data = await res.json();
    if(data.ok){
        alert("Alumno actualizado con exito.");
        tableName.innerText = nombre.value
    }else{
        alert(data.message);
    }
};

const addStudent = async(event)=>{
    event.preventDefault();
    const nombre = event.target.children.nombre
    const res = await fetch("/api/alumnos",{
        method:"POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({nombre:nombre.value})
    });
    
    const data = await res.json();
    studentList.innerHTML+=componentStudentList(data)
    nombre.value = ""
}

const deleteStudent = async (id)=>{
    const res = await fetch("/api/alumnos",{
        method: "DELETE",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({id})
    });

    const data = await res.json();
    if(data.ok) return alert("Registro eliminado.");
    alert(data.message);
}

const getAsistance = async(date)=>{
    const res = await fetch("/api/asistencias?fecha="+date);
    const data = await res.json();
    return data;
}

const postAsistance = async(students)=>{
    const res = await fetch("/api/asistencias/",{
        method:"POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(students)
    })
    const data = await res.json();
    data.ok ? alert("Asistencia agregada.") : alert(data.message)
}

const addAsistance = async ()=>{
    const students = document.querySelectorAll("tr[data-asistance-id]");
    const date = document.getElementById("date");
    if(date.value ==="") return alert("Agregar fecha.");
    const data = {
        fecha: date.value,
        alumnos:[]
    }
    for(const student of students){
        data.alumnos.push({
            alumno_id: Number(student.dataset.asistanceId),
            asistencia: student.children.select.children.asistance.value
        })
    }

    await postAsistance(data);
}

const showAsistance = (asistance)=>{
    showAsistanceBody.innerHTML = "";
    asistance.map(e=>{
        showAsistanceBody.innerHTML += componentShowAsistance(e)
    })
}

const searchAsistance = async (event)=>{
    event.preventDefault();
    const date = event.target.children.dateAsistance;
    const asistance = await getAsistance(date.value);
    showAsistance(asistance);
}

document.addEventListener('click',async (e)=>{
    if(e.target.classList.contains('edit-btn')){
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        const nombre = tr.dataset.name;
        document.getElementById("nuevoNombre").value = nombre;
        document.getElementById("id").value = id;
    }

    if(e.target.classList.contains('delete-btn')){
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        await deleteStudent(id);
        tr.remove();
    }
})

showStudents();
showStudentsAsistance();