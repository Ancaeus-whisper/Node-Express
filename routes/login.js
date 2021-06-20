var express = require('express');
var router = express.Router();
var fs = require('fs');      //文件解析
var cookie=require('cookie-parser'); //cookie中间件
var session=require('express-session');//session中间件
var path = require('path');  //系统路径
var db=require('./dataBase');
var hasLogin=false;

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

router.get('/login_confirm',function(req,res)
{
    db.Search("user","Name",req.query.username,function(err,data)
    {
        hasLogin=false;
        if(err){console.log(err.message);}
        else data.forEach(function(value)
        {
            if(value.Name==req.query.username.toString()&&value.Password==req.query.pwd.toString())
            {
                if(req.query.hasCookie == "on")  //为实现自动登录，需要在用户电脑中留下cookie
                {
                   res.cookie("username",value.Name, {maxAge: 600000, path:'/login',httpOnly:true});
                   res.cookie("password",value.Password, {maxAge: 600000, path:'/login',httpOnly:true});          
                }
                hasLogin=true;
                req.session.username=value.Name;
                req.session.save();
                res.send(200,{"message":"登录成功"});
            }
        })
        if(hasLogin==false) res.send(400,{"error":"用户名/密码错误"});
    });
}
)

router.get('/',function(req,res)
{
    if(req.session.username){res.render('AccessDenied');} 
    else 
    {
        res.render('logintest',{isLogin:false,username:""});
    }
    
})

module.exports = router;