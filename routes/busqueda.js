var express = require('express');
var app = express();
let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');

app.get('/coleccion/:tabla/:busqueda', (req, res)=>{
    let promesa = null;
    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let expresionregular = new RegExp(busqueda, 'i');// [ara hacer como el like de SQL i = insensible a minus o mayus]
    if (tabla === 'usuario') {
        promesa = buscarUsuario(busqueda, expresionregular);
    }else if(tabla === 'hospital'){
        promesa = buscarHospitales(busqueda, expresionregular);
    }else if (tabla === 'medico') {
        promesa = buscarMedicos(busqueda, expresionregular);
    }else{
        res.status(400).json({
            ok:false,
            mensaje: 'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
            error:{ message: 'Tipo de coleccion no valido'}
        })
    }
    promesa.then( data =>{
        res.status(200).json({
            ok:true,
            [tabla]: data// no es la palabra tabla sino la variable
        })
    })
})

//// BUESQUEDA GENERAL ///////
app.get('/todo/:busqueda', (req, res)=>{
    let busqueda = req.params.busqueda;
    var expresionregular = new RegExp(busqueda, 'i');// [ara hacer como el like de SQL i = insensible a minus o mayus]
   Promise.all([//hace todas las promesas al mismo tiempo 
       buscarHospitales(busqueda, expresionregular), 
       buscarMedicos(busqueda, expresionregular),
       buscarUsuario(busqueda, expresionregular)
    ]).then(respuestas =>{
        res.status(200).json({
            ok:true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    })
    
});

function buscarHospitales(busqueda, expresionReg){
    return new Promise((resolve, reject)=>{
        Hospital.find({nombre: expresionReg})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales)=>{
                if (err) {
                    reject('Error al cargar hospitales');
                }else{
                    resolve(hospitales)
                }
            })
    });
}

function buscarMedicos(busqueda, expresionReg){
    return new Promise((resolve, reject)=>{
        Medico.find({nombre: expresionReg})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos)=>{
                if (err) {
                    reject('Error al cargar medicos');
                }else{
                    resolve(medicos)
                }
            })
    });
}

function buscarUsuario(busqueda, expresionReg){
    return new Promise((resolve, reject)=>{
        Usuario.find({}, 'nombre email role')
                .or([ {nombre: expresionReg}, {email: expresionReg}])
                .exec((err, usuariosDB)=>{
                    if (err) {
                        reject('Error al cargar usuarios', err);
                    }else{
                        resolve(usuariosDB)
                    }
                })
    });
}

module.exports = app;