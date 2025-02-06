// SIEMPRE 2 OBJETOS
    // EXPRESS
    // POOL
    // Toda petición cliente-servidor lleva implícito dos objetos
        // request, response
        const express = require('express');
        const {Pool} = require('pg');
        const cors = require("cors");

        // INSTANCIAR
        const app = express();
        const pool = new Pool();
        const port = 3000;

        // CORS
        app.use(cors());

        //JSON
        app.use(express.json());

        // GETTER
            // SELECT
            app.get('/api/peliculas?USER=A&PASSWORD=1234', async(req, res) => {

            });
        // PUT
            // UPDATE
        // POST
            // INSERT
                // LOGIN
                app.post('/api/login', async(req, res) => {
                    // RECUPERAR PARÁMETROS SI CORRESPONDE
                        // BODY.PARAMS
                        // QUERY.PARAMS
                        // PATH.PARAMS
                        const {username, password} = req.body;
                });
        // DELETE
            // DELETE




            app.listen(port, () => {
                console.log(`Servidor corriendo en http://localhost:${port}`);
              });