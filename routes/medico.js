var express = require('express')
var app = express();
var Medico = require('../models/medico')
var middAutenticacion = require('../middlewares/autenticacion')

app.get('/', (req, res)=>{
    let desde = Number(req.query.desde || 0);
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'email nombre')
        .populate('hospital')
        .exec( (err, medicoDB)=>{
            if (err) return res.status(500).json({ ok:false, error:err});
            Medico.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok:true,
                    medicos: medicoDB,
                    total:conteo
                });
            })
        })
})

app.post('/', middAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medicoDB)=>{
        if (err) return res.status(400).json({ ok:false, error:err});
        
        res.status(201).json({
            ok:true,
            medicos: medicoDB
        });
    })
});

app.put('/:id', middAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Medico.findByIdAndUpdate(id,req.body, {new:true}, (err, medicoDB)=>{
        if (err) return res.status(500).json({ ok:false, error:err});
        if (!medicoDB) return res.status(400).json({ ok:false, error:err});
        res.status(200).json({
            ok: true,
            medico:medicoDB
        })
    })

});

app.delete('/:id', middAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Medico.findByIdAndDelete(id, (err, medicoDB)=>{
        if (err) return res.status(500).json({ ok:false, error:err});
        if (!medicoDB) return res.status(400).json({ ok:false, error:err});
        res.status(200).json({
            ok: true,
            medico:medicoDB
        })
    })
})

module.exports = app;