document.getElementById('loginForm').addEventListener('submit', async function(event) {
    console.log('Formulario enviado');  // Verifica si el evento de submit se está ejecutando
    event.preventDefault();  // Previene el comportamiento por defecto del formulario (recargar la página)
    
    // Obtener los valores de los campos
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Enviar la solicitud al servidor
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login exitoso: ' + data.username);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Hubo un problema al intentar iniciar sesión.');
    }
});
