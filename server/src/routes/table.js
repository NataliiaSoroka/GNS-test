const express = require('express');
const router = express.Router();
const Table = require('../models/table-model');

router.post('/table', (req, res) => {
    const item = new Table({
        name: req.body.name,
        location: req.body.location,
        currency: req.body.currency
    })
    item.save((err, data) => {
        if (err) {
            console.error(err)
        } else {
            res.send({
                success: true,
                message: `Item with ID_${data._id} saved successfully!`
            })
        }
    })
})

router.get('/table', (req, res) => {
    Table.find({}, 'name location currency', (err, table) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({ table: table })
        }
    }).sort({ _id: -1 })
})

router.put('/table/:id', (req, res) => {
    Table.findById(req.params.id, 'name location currency', (err, item) => {
        if (err) {
            console.log(err)
        } else {
            if (req.body.name) {
                item.name = req.body.name
            }
            if (req.body.location) {
                item.location = req.body.location
            }
            if (req.body.location) {
                item.currency = req.body.currency
            }
            item.save(err => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200)
                }
            })
        }
    })
})

router.delete('/table/:id', (req, res) => {
    Table.remove({ _id: req.params.id }, err => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    })
})

module.exports = router