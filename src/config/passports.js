const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const User = require('../models/Users');
const Parametrization = require('../models/Parametrization');
require('../controllers/userController')();

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  // Match Email's User
  const user = await User.findOne({ email: email });
  if (!user) {
    return done(null, false, { message: 'Usuario o Contraseña Incorrecta.' });
  } else {

    // Match Password's User
    //days expired
      //lastLogin

    const match = await user.matchPassword(password);
    if (match && user.userBlocked == false) {
      parametersTries = await Parametrization.findOne({ code: 'maxTries' });
      const maxTries = parametersTries.value;
      const numberAttempsUser = user.numberAttemps;
      const days = subtractDays(user.passwordExpireTime, new Date());

      if (numberAttempsUser*1 > maxTries*1 || days > 0) {
        user.userBlocked = true;
        return done(null, false, { message: 'Usuario bloqueado por favor Comuniquese con los encargados del sistema.' });
      }
      

      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    } else {
      if(user.userBlocked === false){
        user.numberAttemps = user.numberAttemps*1 + 1;
        await user.save();
      return done(null, false, { message: 'Usuario o Contraseña Incorrecta.' });
      }else{
        return done(null, false, { message: 'Usuario bloqueado por favor Comuniquese con los encargados del sistema.2' });
      }
      
    }
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});