const studentList = document.getElementById("studentsList");

const component = (e)=>{
    return`
        <tr data-id="${e.id}" data-name="${e.nombre}">
            <td>${e.id}</td>
            <td id="student-${e.id}">${e.nombre}</td>
            <td><button class="edit-btn">Editar</button></td>
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
    const data = await getStudents()
    data.map(e=>{
        studentList.innerHTML += component(e);
    })
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
    studentList.innerHTML+=component(data)
}

document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('edit-btn')){
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        const nombre = tr.dataset.name;
        document.getElementById("nuevoNombre").value = nombre;
        document.getElementById("id").value = id;
    }
})

showStudents()