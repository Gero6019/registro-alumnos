const studentList = document.getElementById("studentsList");
const asistanceBody = document.getElementById("asistanceBody");
const showAsistanceBody = document.getElementById("showAsistanceBody");

const componentStudentList = (e)=>{
    return`
        <tr data-id="${e.id}" data-name="${e.nombre}">
            <td>${e.id}</td>
            <td id="student-${e.id}">${e.nombre}</td>
            <td class="editIcons">
                <button class="edit-btn"><i class="material-icons editStudent" style="font-size:26px">edit</i></button>
                <button class="delete-btn"><i class="fa fa-close deleteStudent" style="font-size:26px"></i></button>
            </td>
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
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="justificado">Justificado</option>
                </select>
            </td>
        </tr>
    `
}

const componentShowAsistance = (e)=>{
    return`
        <tr data-asistance-id="${e.id}">
            <td>${e.id}</td>
            <td>${e.nombre}</td>
            <td name="select">
                <select name="selectEditAsistance">
                    <option value="presente" ${e.presente=='presente'? "selected":''}>Presente</option>
                    <option value="ausente" ${e.presente=='ausente'? "selected":''}>Ausente</option>
                    <option value="justificado" ${e.presente=='justificado'? "selected":''}>Justificado</option>
                </select>
            </td>
            <td><i class="fa fa-save editAsistance"></i></td>
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
        setHidden("updateStudent")
        alert("Alumno actualizado con exito.");
        tableName.innerText = nombre.value
    }else{
        alert(data.message);
    }
};

const cancelPutStudent = (e)=>{
    const form = e.target.closest("form");
    form.children.id.value = ""
    form.children.nuevoNombre.value = ""
    setHidden("updateStudent")
}

const postStudent = async(nombre)=>{
    const res = await fetch("/api/alumnos",{
        method:"POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({nombre})
    });
    
    const data = await res.json();
    if(data.ok){
        return data;
    }
    alert("Error al crear estudiante.");
    console.log(data.error);
}

const addStudent = async(event)=>{
    event.preventDefault();
    const nombre = event.target.children.nombre;
    const data = await postStudent(nombre.value);
    studentList.innerHTML+=componentStudentList(data);
    asistanceBody.innerHTML+=componentAsistanceList(data);
    nombre.value = "";
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
    console.log(data.error);
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
    data.ok ? alert("Asistencia agregada.") : console.log(data.error)
}

const putAsistance = async(asistance)=>{
    const res = await fetch("/api/asistencias/",{
        method:"PUT",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(asistance)
    })
    const data = await res.json();
    data.ok ? alert("Asistencia actualizada.") : console.log(data.error)
}

const addAsistance = async ()=>{
    const students = document.querySelectorAll("tr[data-asistance-id]");
    const date = document.getElementById("date");
    if(date.value ==="") return alert("Fecha vacia.");
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

const logout = async()=>{
    const res = await fetch("/api/logout",{
        method:"POST",
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const data = await res.json();
    if(data.ok){
        document.location.href = data.redirect;
    } 
}

const setHidden = (hidden)=>{
    const component = document.getElementById(hidden);
    const checkHidden = component.classList;
    checkHidden.value.includes("hidden") ? component.classList.remove("hidden") : component.classList.add("hidden");
    
}

document.addEventListener('click',async (e)=>{
    if(e.target.classList.contains('editStudent')){
        const component = document.getElementById("updateStudent");
        component.classList.value.includes("hidden") ? setHidden('updateStudent') : "";
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        const nombre = tr.dataset.name;
        document.getElementById("nuevoNombre").value = nombre;
        document.getElementById("id").value = id;
    }

    if(e.target.classList.contains('deleteStudent')){
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        const opt = confirm("¿Estas seguro de eliminar el registro?")
        const asistanceTd = document.querySelector(`[data-asistance-id="${id}"]`)
        if(opt){
            await deleteStudent(id);
            tr.remove();
            asistanceTd.remove();
        }
    }
    
    if(e.target.classList.contains('editAsistance')){
        const tr = e.target.closest("tr");
        const asistance = tr.children.select.children.selectEditAsistance.value;
        const alumno_id = tr.dataset.asistanceId;
        const date = document.getElementById("dateAsistance").value;
        await putAsistance({alumno_id,asistencia:asistance,fecha:date});
    }
})

showStudents();
showStudentsAsistance();