const URL = "";
const GET_PELICULAS = "/peliculas";
const GET_LOGIN = "/usuarios";
function login() {
    // Cómo puedo recuperar el valor de los elementos del formulario
    document.getElementById('username');
    document.getElementById('password');

    const response = fetch (
        URL,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password}),
        }
    )
}