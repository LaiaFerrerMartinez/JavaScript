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
                        const sqlQuery = ""
                            sqlQuery+="SELECT ";
                            sqlQuery+="FROM USUARIOS ";
                            sqlQuery+="WHERE USERNAME = $1";
                            sqlQuery+="AND";
                            sqlQuery+="PASSWORD = $2;";
                            const result = pool.query(sqlQuery, [username, password]);
                            const user = result.row[0];
                                user.username;
                                user.password;
                            const respuesta = {message: 'Correcto'};
                            res.json(respuesta);
                            res.json({
                                message: 'Correcto',
                                username: user.username
                            });

                        /*
                            SELECT *
                            FROM USUARIOS
                            WHERE
                                USERNAME = 'ADMIN'
                                AND
                                PASSWORD = '1234';
                        */
                });
        // DELETE
            // DELETE




            app.listen(port, () => {
                console.log(`Servidor corriendo en http://localhost:${port}`);
              });