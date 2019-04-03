const mongoose = require('mongoose');
const {Schema} = mongoose;

const ParametrizationSchema = new Schema({
    name: {type: String ,required:true},
})

module.exports = mongoose.model('kRoles',ParametrizationSchema);