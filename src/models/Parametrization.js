const mongoose = require('mongoose');
const {Schema} = mongoose;

const ParametrizationSchema = new Schema({
    name: {type: String ,required:true},
    code: {type: String ,required:true},
    value: {type: String ,required:true,default:0}
})

module.exports = mongoose.model('kParameters',ParametrizationSchema);