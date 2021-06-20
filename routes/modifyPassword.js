var express = require('express');
var router = express.Router();
var nodemailer=require('nodemailer');//发送邮件
var multipart = require('connect-multiparty');
var path = require('path');  //系统路径
var db=require('./dataBase');




let transporter = nodemailer.createTransport({
    //node_modules/nodemailer/lib/well-known/services.json  邮箱的端口设置在这里查看
    service: 'qq', //类型qq邮箱
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '413979384@qq.com', // 发送方的邮箱
        pass: 'igwhadkwphcebgfi' // smtp 的授权码
    }
});

var V_Code='/*543453sdfaweea21!';

router.get('/email',function(req, res) {
    var mail = req.query.emailAddress
    V_Code = parseInt(Math.random(0, 1) * 10000) //生成随机验证码    
    let mailOptions = {
        from:"413979384@qq.com",
        to:mail,
        subject:"验证码",
        text:"您的验证码：  "+V_Code
    }
    if (!mail||mail=="") {
        return res.send('参数错误')
    } //email出错时或者为空时

    //发送邮件
    transporter.sendMail(mailOptions, (err,data)=> {
        if (err) {
            res.json({status:400,msg:"send fail....."})
        } else {
            res.json({status:200,msg:"邮件发送成功....."})
        }
       res.end();
    })
});

router.get('/save',function(req, res) 
{
db.Search("user","Name",req.query.username,function(err,data)
{
    if(data==null)
    {
        res.send(400,{error:"用户不存在"});
        return;  
    }
    if(req.query.username.toString()!=data[0].Name)  //验证用户名
    {
        res.send(400,{error:"用户名错误"});
        return;
    }
    if(req.query.email.toString()!=data[0].Email)  //验证邮箱
    {
        res.send(400,{error:"邮箱错误"});
        return;
    }
    if(req.query.vcode.toString()!=V_Code.toString())   //验证验证码
    {
        res.send(400,{error:"验证码错误"});
        return;
    }
    //var pwd=req.query.pwd;
    //console.log(pwd);
    db.Modify("user",data[0].Id,"Password",req.query.pwd);
    res.send(200,{message:"修改成功！"});
});
})

router.get('/',function(req, res) {
if(req.session.username) res.render('pwd_modify',{isLogin:false,username:req.session.username});
else res.render('pwd_modify',{isLogin:false,username:""});
});

module.exports = router;