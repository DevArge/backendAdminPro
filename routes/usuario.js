var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var middAutenticacion = require('../middlewares/autenticacion')

app.get('/', (req, res, next)=>{
    let desde = Number(req.query.desde || 0);
    Usuario.find({},'nombre email img role')
           .skip(desde)
           .limit(5)
           .exec((err, usuarioDB)=>{
                if(err) return res.status(500).json({ok:false, mensaje: 'Error cargando usuario', errors: err})
                Usuario.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok:true,
                        Usuarios: usuarioDB,
                        total: conteo
                    })
                })
            });
});

app.post('/', middAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioDB)=>{
        if(err) return res.status(400).json({ok:false, mensaje: 'Error al crear usuario', errors: err})
        res.status(201).json({
            ok:true,
            Usuario: usuarioDB
        });
    });
});

app.put('/:id', middAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuarioDB)=>{
        if(err) return res.status(500).json({ok:false, mensaje: 'Error al crear usuario', errors: err})
        if (!usuarioDB) {
            return res.status(400).json({
                ok:false,
                mensaje: 'El usuario no existe',
                error: { message: 'No existe un usuario con ese ID'}
            })
        }
        usuarioDB.nombre= body.nombre;
        usuarioDB.email= body.email;
        usuarioDB.role= body.role;

        usuarioDB.save((err, usuarioGuardado)=>{
            if(err) return res.status(400).json({ok:false, mensaje: 'Error al actualizar usuario', errors: err})
            usuarioGuardado.password = ':)'
            res.status(200).json({
                ok:true,
                Usuario: usuarioGuardado
            });
        })
    })
});

app.delete('/:id', middAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioDB)=>{
        if(err) return res.status(500).json({ok:false, mensaje: 'Error al borrar usuario', errors: err})
        if(!usuarioDB) return res.status(400).json({ok:false, mensaje: 'No existe un usuario con ese ID', errors: err})
        res.status(200).json({
            ok:true,
            Usuario: usuarioDB
        });
    })
})

module.exports = app;