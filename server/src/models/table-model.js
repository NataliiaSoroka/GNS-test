const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TableSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    location: {
        type: String
    },
    currency: {
        type: Number
    }
})
const TableModel = mongoose.model('table', TableSchema)
module.exports = TableModel