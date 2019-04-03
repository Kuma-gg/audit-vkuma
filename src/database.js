const mongoose = require('mongoose');
mongoose.connect('mongodb://ci-mastery-user:ci-mastery-password-6@ds213183.mlab.com:13183/ci-mastery')
.then(db=>console.log('connected'))
.catch(err =>console.log('ccccccccccccccccc' + err));