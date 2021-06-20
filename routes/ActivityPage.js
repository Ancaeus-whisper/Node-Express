var express = require('express');
var router = express.Router();
var async=require('async'); //拜拜嘞，回调地狱（解释：这个组件可以解决异步IO的问题）
var db=require('./dataBase');

router.get('/',function(req,res)
{
    if(req.query.name) 
    db.Search("activity","Name",req.query.name,function(err,data)
    {
        if(err) res.send(400,err);
        else if(req.session.username)
        {
            res.render('ActivityPage',{isLogin:true,username:req.session.username,activity:data[0]});
        }else res.render('ActivityPage',{isLogin:false,username:"",activity:data[0]});
    });
    else res.redirect('/');
});

module.exports = router;