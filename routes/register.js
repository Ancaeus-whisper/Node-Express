var express = require('express');
var router = express.Router();
var fs = require('fs');      //文件解析
var path = require('path');  //系统路径
var db=require('./dataBase');

var numberTest= /[0-9]/;

var alphaTest=/[a-z]/i;

var index;

router.get('/',function(req,res)
{
    var user;
    var length=0;
    db.Search("user","Name",'*',function(err,data)
    {
       user=data;      
        user.forEach(function(value)
        {
           length++;
        })
        index=length+1;
    });
    
    if(req.session.username)
    res.render('register',{isLogin:true,username:req.session.username});
    else res.render('register',{isLogin:false,username:""});
})

router.get('/register_check',function(req,res)
{
    if(numberTest.test(req.query.pwd)&&alphaTest.test(req.query.pwd)){}
    else
    {
        res.send(400,{"error":"密码必须要包含数字和字母"});
            return;
    }
    db.Search("user","Name","*",function(err,data)
    {
        var isSame=false;
        data.forEach(function(value)
    {
        if(value.Name==req.query.username.toString()||value.Password==req.query.pwd.toString()||req.query.address.toString()==value.Email||req.query.username.length<=6)
        {
            res.send(400,{"error":"信息重复"});
            isSame=true;
        }       
    }); 
    if(!isSame)
    {
        db.InsertUser(index,req.query.username,req.query.major,req.query.sex,req.query.phonenumber,req.query.address,req.query.pwd);
    res.send(200,{"message":"注册成功"});
    }
    })
   
})

module.exports = router;