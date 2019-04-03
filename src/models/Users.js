const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String,required:true},
    email : {type:String,required:true},
    password : {type:String , required:true},
    createdDate : {type:Date,default:Date.now},
    lastTimeSet : {type:Date,default:Date.now},//ultimo cambio
    passwordExpireTime : {type:Date,default:Date.now},//expiracion de la contraseña
    lastLogin : {type:Date,default:Date.now}, //ultimo loggeo 
    role : { type: Schema.Types.ObjectId, ref: 'kRoles' },
    enabled: {type:Boolean, default: true, required:true}, 
    userBlocked: {type:Boolean, default: false, required:true},
    numberAttemps : {type:String,default:0},
})

UserSchema.methods.encryptPassword = async (password) => {
    const salt =  await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};

UserSchema.methods.matchPassword =  async function(password){
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('kUsers',UserSchema);