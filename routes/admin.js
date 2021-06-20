var express = require('express');
var router = express.Router();

var cookie=require('cookie-parser'); //cookie中间件

router.get('/',function(req,res)
{
    if(req.session.AccessMode!="Admin")  //访问限制
    {
        res.render('AccessDenied'); 
        return;
    }
    res.render('Admin',{username:req.cookie.user_name});
});

module.exports = router;