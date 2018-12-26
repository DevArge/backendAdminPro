// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Server index config // para habilitar la carpeta upload para q sea accedida desde el navegador
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/upload', serveIndex(__dirname + '/upload'))

//rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);   
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

//conxion BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if (err) throw err;
    console.log('Base de datos mongo: \x1b[32m%s\x1b[0m', 'online');
});

app.listen(3000, ()=>{// esos caracteres raros ponen en verde los mensajes en la consola
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
    
});

