// SIEMPRE 2 OBJETOS
    // EXPRESS
    // POOL
    // Toda petición cliente-servidor lleva implícito dos objetos
        // request, response
        const express = require('express');
        const {Pool} = require('pg');

        // INSTANCIAR
        const app = express();
        const pool = new Pool();

        // CORS
        app.use(cors());

        //JSON
        app.use(express.json());