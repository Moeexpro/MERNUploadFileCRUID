const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    file : String,
    fileName : String
});


module.exports = mongoose.model('FileSchema',fileSchema);

