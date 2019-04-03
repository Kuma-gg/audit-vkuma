const router = require('express').Router();
require('../controllers/userController')();

const bcrypt = require('bcryptjs');
const User = require('../models/Users')
const Role = require('../models/Roles')
const Parametrization = require('../models/Parametrization');

const passport = require('passport');
// Helpers
const { isAuthenticated } = require('../helpers/auth');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/about',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signin');
});

router.get('/users/create', isAuthenticated, async (req, res) => {
    const roles = await Role.find();
    res.render('users/Create', { roles });
});

router.post('/users/save', isAuthenticated, async (req, res) => {

    const { name, password, passwordChek, email, roles,enableUser } = req.body;
    errors = [];
    const params = await Parametrization.find();
    const verifyEmail = await User.findOne({ email: email });
    boolEnableUser = true;

    if(enableUser == "on"){
        boolEnableUser = false;
    }
    passwordVerifications = verifyParametrizationsPassword(password, params);

    if (passwordVerifications.length > 0) {
        passwordVerifications.forEach(element => {
            errors.push({ text: element.text });
        });
    }

    if (verifyEmail != null) {
        errors.push({ text: 'El correo electronico ya se encuentra registrado ya se encuentra registrado' });

    }

    if (!name || !password || !passwordChek || !email) {
        errors.push({ text: 'Rellene todos los campos' });
    }

    if (password != passwordChek) {
        errors.push({ text: 'Fallo en la verificacion de la contraseña' });
    }


    if (errors.length > 0) {
        const roles = await Role.find();
        res.render('users/create', {
            errors,
            name,
            email,
            roles
        });

    } else {
        const picked = params.find(o => o.code === 'passwordTimeDuration');
        const expireTime = sumDays(picked.value, new Date());
        const roleG = await Role.findOne({ _id: roles });
        const newUser = new User({
            name: name,
            email: email,
            passwordExpireTime: expireTime,
            userBlocked :boolEnableUser,
            role: roleG._id
        })
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        res.redirect('list');
    }
});

router.get('/users/list', isAuthenticated, async (req, res) => {

    const users = await User.find({ enabled: true }).populate('role');
    res.render('users/list', { users });
});

router.get('/users/edit/:id', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.params.id).populate('role');;
    const roles = await Role.find();
    const idRol = user.role._id;
    res.render('users/edit', { user, roles, idRol });
});

router.get('/users/delete/:id', isAuthenticated, async (req, res) => {
    await User.findOneAndUpdate({ _id: req.params.id }, { enabled: false });
    res.redirect('../list');
});

router.post('/users/update/:id', isAuthenticated, async (req, res) => {
    const { name, password, passwordChek, email, roles, editPassword,enableUser } = req.body;
    const errors = [];
    const params = await Parametrization.find();
    const editUser = await User.findOne({ _id: req.params.id });
    passwordVerifications = verifyParametrizationsPassword(password, params);
    const isEqual = await bcrypt.compare( password,editUser.password);
    
    boolEnableUser = true;

    if(enableUser == "on"){
        boolEnableUser = false;
    }

    if (editPassword == 'on' && isEqual) {
        errors.push({ text: 'La contraseña debe ser diferente a la anterior.' });
    }
    if (passwordVerifications.length > 0 && editPassword == 'on') {
        passwordVerifications.forEach(element => {
            errors.push({ text: element.text });
        });
    }

    if (!name || !email) {
        errors.push({ text: 'Rellene todos los campos' });
    }

    if (password != passwordChek) {
        errors.push({ text: 'Fallo en la verificacion de la contraseña' });
    }

    if (errors.length > 0) {

        errors.forEach(element => {
            req.flash('success_msg', element.text);
        });

        res.redirect('../edit/' + editUser._id);
    } else {
        const roleG = await Role.findOne({ _id: roles });
        editUser.name = name;
        if (req.user.role == '5c9fc7ff9a56991f9c78b5a7') {
            editUser.email = email;
            editUser.role = roleG._id;
            editUser.userBlocked = boolEnableUser;
            editUser.numberAttemps = 0;
        }


        if (editPassword == 'on') {
            editUser.password = await editUser.encryptPassword(password);
            const picked = params.find(o => o.code == 'passwordTimeDuration');
            const expireTime = sumDays(picked.value, new Date());
            editUser.passwordExpireTime = expireTime;
            editUser.lastTimeSet=new Date();

        }

        await editUser.save();
        req.flash('success_msg', 'Editado Satisfactoriamente');
        res.redirect('../list');
    }
});

router.get('/users/logout', isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Sesion Terminada');
    res.redirect('/users/signin');
});

module.exports = router;