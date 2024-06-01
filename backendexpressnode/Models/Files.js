const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    file : String,
    fileName : String,
    file64: String
});


module.exports = mongoose.model('FileSchema',fileSchema);

