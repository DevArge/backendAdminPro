// Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

//conxion BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if (err) throw err;
    console.log('Base de datos mongo: \x1b[32m%s\x1b[0m', 'online');
});

//rutas
app.get('/', (req, res, next)=>{
    res.status(200).json({
        ok:true,
        mensaje: 'Peticion realizada'
    });
});

app.listen(3000, ()=>{// esos caracteres raros ponen en verde los mensajes en la consola
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
    
});

