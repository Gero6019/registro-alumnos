const login = async (event)=>{
    event.preventDefault();
    const name = event.target.children.name
    const password = event.target.children.password
    const user = {
        name: name.value,
        password: password.value
    }

    const res = await fetch("/api/login",{
        method: 'POST',
        credentials: "include",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    const data = await res.json();
    if(data.status === "Error") return alert(data.message);
    document.location.href = data.redirect;
}