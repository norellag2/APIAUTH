const express = require('express');
const app = express();
const connection = require('../db');
const {v4: uuidv4} = require('uuid');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');


//(esto es lo primero que hemos hecho) app.get('/', (req, resp) => {
//     resp.json({
//         message: 'Ejecutado desde usuarios'
//     })
//     // la '/' corresponde en spp.js a /users
// })

// Post para registrar nuevos usuarios

app.post('/', (req, resp) => {
   const password = bcrypt.hashSync(req.body.password, 10);
   const query = `INSERT INTO usuarios (id, nombre, apellidos, email, password)
   VALUES ('${uuidv4().toString()}', '${req.body.nombre}', '${req.body.apellidos}', '${req.body.email}', '${password}')`;

    connection.query(query,(error, data) => {
        if(error?.errno === 1062){
            
            return resp.status(400).json({
                message: 'El email ya existe'
            })
        }
        resp.status(200).json ({
            message: 'ok'
        })
    })

})

//Post para login de usuarios

app.post('/login', (req, resp) =>{
    const query = `SELECT * FROM usuarios WHERE email = '${req.body.email}'`;
    connection.query(query, (err, data) => {
        console.log(data);
        console.log(err);
        if(data.length === 0) {
            return resp.status(400).json({
                message: 'El email no existe'
            })
        }
        if(!bcrypt.compareSync(req.body.password, data[0].password)){

            return resp.status(400).json({
                message: 'El usuario o contraseña son incorrectos'
            })
        }
       if(err) {
        return resp.status(500).json({
            message: 'El servidor no se encuentra disponible en estos momentos'
        })
       }
       const user = {
            id: data[0].id,
            nombre: data[0].nombre,
            apellidos: data[0].apellidos,
            email: data[0].email
       }
       const token = jwt.sign(user, 'ffgjjjwed', {expiresIn: 60}); //expireIn (segundos) estos segundos los ponemos nosotros pasa ese tiempo y caduca la sesión
       resp.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'none', maxAge: 60 * 1000});
       resp.status(200).json({
        message: 'ok',
        user
       })
    })
})

//Post de comprobación del token
app.get('/check', (req, resp) => {
    if(req.cookies.token === undefined) {
        return resp.status(403).json({
            message: 'Acceso denegado'
        })
    }
    jwt.verify(req.cookies.token, 'ffgjjjwed', (error, decoded) => {
        if(error) {
            return resp.status(403).json({
                message: 'Acceso denegado'
            })
        }
      const user = {
        id: decoded.id,
        nombre: decoded.nombre,
        apellidos: decoded.apellidos,
        email: decoded.email
      }
        resp.status(200).json({
            message: 'ok',
            user
        })
    })
})

module.exports = app;

//Semilla es esto : 'ffgjjjwed'