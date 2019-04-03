const mongoose = require('mongoose');
const {Schema} = mongoose;

const AcitonSchema = new Schema({
    name: {type: String,required:true}
})

module.exports = mongoose.model('kAction',UserSchema);