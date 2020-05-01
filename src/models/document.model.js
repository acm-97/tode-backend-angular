const mongoose = require('mongoose');
const Schema = mongoose.Schema

const documentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El campo (nombre del documento) del documento es requerido']
    },
    autor: {
        type: Schema.ObjectId,
        ref: 'oauth2User',
        required: [true, 'No existe usuario al cual asiganar el documento']
    }
}, {
    timestamps: true
})

const Document = mongoose.model('document', documentSchema);
module.exports = Document;