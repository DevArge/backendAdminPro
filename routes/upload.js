var express = require('express');
var app = express();
var fileupload = require('express-fileupload');
var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')
var fs = require('fs');

app.use(fileupload());

app.put('/:tipo/:id', (req, res)=>{
    var tipo = req.params.tipo;
    var id = req.params.id;
    /// tipos validos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
       return res.status(500).json({ok:false, mensaje: 'tipo de coleccion no es valido', errors: {message: 'Tipo de coleccion no es valido'}})        
    }
    if (!req.files) {
       return res.status(500).json({ok:false, mensaje: 'no selecciono nada'})
    }
    // obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // solo estas extensiones se aceptan
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
       return res.status(500).json({ok:false, mensaje: 'Extension no valida'})        
    }

    // nombre del archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`

    //mover el archivo del temporal a un path
    var path = `./upload/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err =>{
        if (err) {
            return res.status(500).json({ok:false, mensaje: 'Error al mover el archivo', errors: err })        
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
    })

})


function subirPorTipo(tipo, id, nombreArchivo, res){

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuarioDB)=>{
            if (!usuarioDB) {
                return res.status(500).json({ok:false, mensaje: 'Usuario no existe', errors: err })        
            }
            var pathViejo = './upload/'+ tipo +'/' + usuarioDB.img;
            // si existe el path lo elimina para q no se duplique cuando se cree
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuarioDB.img = nombreArchivo;
            usuarioDB.save((err, usuarioActualizado)=>{
                usuarioActualizado.password = ':)'
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })
            })
        })
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medicoDB)=>{
            if (!medicoDB) {
                return res.status(500).json({ok:false, mensaje: 'Medico no existe', errors: err })        
            }
            var pathViejo = './upload/'+ tipo +'/' + medicoDB.img;
            // si existe el path lo elimina para q no se duplique cuando se cree
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            medicoDB.img = nombreArchivo;
            medicoDB.save((err, medicoActualizado)=>{
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                })
            })
        })
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospitalDB)=>{
            if (!hospitalDB) {
                return res.status(500).json({ok:false, mensaje: 'Hospital no existe', errors: err })        
            }
            var pathViejo = './upload/'+ tipo +'/' + hospitalDB.img;
            // si existe el path lo elimina para q no se duplique cuando se cree
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            hospitalDB.img = nombreArchivo;
            hospitalDB.save((err, hospitalActualizado)=>{
                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de hostpital actualizada',
                    hospital: hospitalActualizado
                })
            })
        })
    }
}

module.exports = app;

