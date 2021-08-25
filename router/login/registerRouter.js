const express = require('express');
const {check, body} = require('express-validator');

const router= express.Router();

const registerController = require('../../controllers/login/registerController');


router.get('/register',registerController.getRegister);
router.get('/',registerController.getIndex);
router.post('/logout',registerController.postlogout);
router.post('/login',registerController.postLogin);
router.post('/register',
    check('email').isEmail().withMessage('must cointain email'),
    check('name').isLength({min:3}).withMessage('name min. 3 characters'),
    body('password').isLength({min:3}).withMessage('password min. 3 characters'),
    body('confirm').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('password have to match');
        }
        return true;
    }),
    registerController.postRegister);

module.exports=router;