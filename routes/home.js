var express = require('express');
var router = express.Router();
var fs = require('fs');      //文件解析
var cookie=require('cookie-parser'); //cookie中间件
var session=require('express-session');//session中间件
var path = require('path');  //系统路径
var async=require('async'); //拜拜嘞，回调地狱（解释：这个组件可以解决异步IO的问题）
var db=require('./dataBase');

router.use(cookie());
router.use(session({
    secret: 'Ancaeus',
    resave: false,
    saveUninitialized: true,
    cookie:
    {
      maxAge:5000000
    },
    rolling:true
}))

router.get('/',function(req,res)
{
    async.waterfall(
        [
            function(cb)
            {
                db.Search("group","Name","*",function(err,data)
                {
                    cb(err,data);
                });
            },
            function(group,cb)
            {
                db.Search("announ","Title","*",function(err,data)
                {
                    cb(err,group,data);
                });
            },
            function(group,announ,cb)
            {
                db.Search("activity","Name","*",function(err,data)
                {
                    cb(err,group,announ,data);
                });
            },
            function(group,announ,activity,cb)
            {
                if(req.session.username)
                db.Search("user","Name",req.session.username,function(err,data)
                {
                    cb(err,group,announ,activity,data);
                });
                else cb(null,group,announ,activity,null);
            }
        ]
        ,
        function(err,group,announ,activity,user)
        {
            if(err){console.log(err.err);}
            else 
            {
                if(req.session.username)
                {
                      res.render('test',{isLogin:true,username:req.session.username,user:user[0],announ:announ,length:Object.keys(announ).length,activity:activity});
                }else res.render('test',{isLogin:false,username:"",user:null,announ:announ,length:Object.keys(announ).length,activity:activity});
            }
        });
    
})

router.get('/support',function(req,res)
{
if(req.session.username)
    {
          res.render('support',{isLogin:true,username:req.session.username});
    }else res.render('support',{isLogin:false,username:""});
});

module.exports = router;