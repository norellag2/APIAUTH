const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const users = require ('./routes/users');

//Abre la API a las peticiones desde Angular
app.use(cors({origin:'http://localhost:4200', credentials: true}));


app.use(express.json()); //Parsea los JSON  entrantes a JavaScript;
app.use(cookieParser()); // Parsea las cookies entrantes a JavaScript;
app.use('/users', users);




app.listen(3000, () => {
 console.log ('Servidor escuchando en http://localhost:3000');
})

// 3000 es el puerto, y el segundo argumento donde el console log si tenemos dominio es lo que tendríamos que poner