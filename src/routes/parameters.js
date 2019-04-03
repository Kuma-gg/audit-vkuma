const router = require('express').Router();
const Parametrization = require('../models/Parametrization')
const Roles = require('../models/Roles')
// Helpers
const { isAuthenticated } = require('../helpers/auth');

router.get('/parameters/edit', isAuthenticated, (req, res) => {
    res.render('parameters/edit');
})

router.get('/parameters/show', isAuthenticated, async (req, res) => {
    //const newParam = new Parametrization({ name:"Minusculas",code:"lowercase",value:true });
     //await newParam.save();
    // name,code,value
    const params = await Parametrization.find();
    res.render('parameters/show', { params });
})

router.post('/parameters/update', isAuthenticated, async (req, res) => {
    const messages = [];
    for (var key in req.body) {
        if (key != null) {
            if (key != null) {
                const valueReq = req.body[key];
                const paramReturned = await Parametrization.findOne({ code: key });
                if (valueReq != paramReturned.value) {
                    await Parametrization.findOneAndUpdate({ code: key }, { value: valueReq });
                    messages.push({ text: 'El Campo ' + paramReturned.name + ' fue actualizado correctamente.' });
                }

            }
        }
    }
    const params = await Parametrization.find();
    res.render('parameters/show', { params, messages });
})
module.exports = router;