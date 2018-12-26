var express = require('express')
var app = express();
var Hospital = require('../models/hospital')
var middAutenticacion = require('../middlewares/autenticacion')

app.get('/', (req, res)=>{
    let desde = Number(req.query.desde || 0);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitalDB)=>{
            if (err) return res.status(500).json({ ok:false, error:err});
            Hospital.count({}, (err, conteo)=>{
                res.status(200).json({
                    ok:true,
                    hospitales: hospitalDB,
                    total: conteo
                });
            });
        })
    })

app.post('/', middAutenticacion.verificaToken, (req, res)=>{
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalDB)=>{
        if (err) return res.status(400).json({ ok:false, error:err});
        
        res.status(201).json({
            ok:true,
            hospitales: hospitalDB
        });
    })
});

app.put('/:id', middAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Hospital.findByIdAndUpdate(id,req.body, {new:true}, (err, hospitalDB)=>{
        if (err) return res.status(500).json({ ok:false, error:err});
        if (!hospitalDB) return res.status(400).json({ ok:false, error:err});
        res.status(200).json({
            ok: true,
            hospital:hospitalDB
        })
    })

});

app.delete('/:id', middAutenticacion.verificaToken, (req, res)=>{
    var id = req.params.id;
    Hospital.findByIdAndDelete(id, (err, hospitalDB)=>{
        if (err) return res.status(500).json({ ok:false, error:err});
        if (!hospitalDB) return res.status(400).json({ ok:false, error:err});
        res.status(200).json({
            ok: true,
            hospital:hospitalDB
        })
    })
})

module.exports = app;