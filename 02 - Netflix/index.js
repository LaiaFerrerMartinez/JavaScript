// API REST

//IMPORTS EN JAVA
const express = require("express");  //API REST -> NODE JS CON EXPRESS
const { Pool } = require("pg"); //HABLAR BD PG DE AWS

// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app  = express();
const port = 3000;
 //CONSULTAR SELECT * FROM USUARIOS, PELICULAS
app.get("/usuarios/" , (req , res) => {
    // req -> no lo necesito
    // res -> si
    res.send('Has solicitado una lista de usuarios');

});

const pool = new Pool({
    user: "postgres",
    host: "netflix-01.c3smyaeku6nl.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "rerreF_2013",
    port: 5432
})

app.get("/peliculas", async (req, res) =>{
    const res = pool.query("SELECT * FROM PELICULAS")
    res.json(result.rows);
});

app.get("/usuarios/:id", (req, res) =>{
    const userId = req.params.id;
    res.send(`El id del usario es: ${userId}`);
});

// ---
app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//LOGIN, PELICULAS POR CATEGORIAS
 // ADD -> INSERT
// app.post("/usuarios/" (req , res)); 
// ELIMINAR -> DELETE             
// app.delete("/usuarios/"); 
// app.put("/usuarios/"); //MODIFICAR -> UPDATE