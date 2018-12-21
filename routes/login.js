var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

app.post('/', (req, res)=>{
    var body = req.body;
    Usuario.findOne({email:body.email}, (err, usuarioDB)=>{
        if(err) return res.status(500).json({ok:false, mensaje: 'Error al buscar usuario', errors: err})
        if (!usuarioDB) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - email',
                error: err
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Credenciales incorrectas - password',
                error: err
            })
        }
        //crear token
        usuarioDB.password = ':)';
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn:14400});
        res.status(200).json({
            ok:true,
            usuario: usuarioDB,
            token
        });
    })
})


module.exports = app;