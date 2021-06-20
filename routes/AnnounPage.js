var express = require('express');
var router = express.Router();
var async=require('async'); //拜拜嘞，回调地狱（解释：这个组件可以解决异步IO的问题）
var db=require('./dataBase');

router.get('/',function(req,res)
{
    db.Search("announ","Id",req.query.Id,function(err,data)
    {
        if(err) res.send(400,err);
        else 
        {
            if(req.session.username) res.render('announPage',{isLogin:true,username:req.session.username,announ:data[0]});
            else res.render('announPage',{isLogin:false,username:"",announ:data[0]});
        }
    });
});

module.exports = router;