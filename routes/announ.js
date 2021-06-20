var express = require('express');
var router = express.Router();
var db=require('./dataBase');
var cookie=require('cookie-parser'); //cookie中间件
var async=require("async");
router.get('/delete',function(req,res)
{
    db.Search("announ","Id",req.query.Id,function(err,data)
    {
        if(err) res.send(400,{message:"失败"});
        else 
        {
            db.Delete("announ",req.query.Id);
            res.send(200,{message:"成功"});
        }
    });
});

router.get('/add',function(req,res)
{
    if(req.query.title==''||req.query.content=='')
    {
        res.send({"message":"标题/正文不能为空！"});
    }
    else async.waterfall(
        [
            function(cb)
            {
                db.Search("user","Name",req.session.username,function(err,data)
                {
                    if(data[0]==null)
                    {
                        res.send({"message":"请先登录"});
                        console.log("请先登录");
                    }
                    else if(data[0].Group==null) 
                    {
                        res.send({"message":"请先加入社团"});
                        console.log("请先加入社团");
                    }
                    else cb(err,data[0]);
                });
            },
            function(user,cb)
            {
                db.Search("announ","Title","*",function(err,data)
                {
                    db.InsertAnnounce(data[Object.keys(data).length-1].Id+1,user.Group,user.Name,req.query.title,req.query.content,0);
                    cb(err);
                });
            }
        
    ],
    function(err)
    {
        if(err)
        {
            console.log(err.message);
            res.send(200,err);
        }
        else 
        {
            res.send(200,{"message":"创建成功"});
        }
    }
    );
});

router.get('/',function(req,res)
{
    db.Search("announ","Name","*",function(err,data)
    {
        if(req.session.username){res.render('announce',{isLogin:true,username:req.session.username,announ:data});}
        else res.render('announce',{isLogin:false,username:"",announ:data});
    });
});

module.exports = router;