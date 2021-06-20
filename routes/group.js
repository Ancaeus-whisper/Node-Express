var express = require('express');
var router = express.Router();
var db=require('./dataBase');
var async=require('async');
var cookie=require('cookie-parser'); //cookie中间件

router.get('/',function(req,res)
{
    if(req.session.username)
    {
        async.waterfall(
            [
               function(cb)
               {
                db.Search("user","Name",req.session.username,function(err,data)
                {
                    cb(err,data);
                });  
               },
               function(user,cb)
               {
                db.Search("group","Name",user[0].Group,function(err,data)
                {
                    if(data[0]==null) res.render('grouptem',{isLogin:true,username:req.session.username});
                    else cb(err,user,data);
                });  
               },
               function(user,group,cb)
               {
                db.Search("announ","Group",group[0].Name,function(err,data)
                {
                    cb(err,user,group,data);
                });
               },
               function(user,group,announ,cb)
               {
                   db.Search("activity","Group",group[0].Name,function(err,data)
                   {
                       cb(err,user,group,announ,data);
                   });
               }
            ]
            ,
            function(err,user,group,announ,activity)
            {
                 if(err) {console.log(err.message);}
                 else
                 {
                    if(req.session.username) res.render('group',{isLogin:true,username:user[0].Name,group:group[0],announ:announ,activity:activity}); 
                    else res.render('group',{isLogin:false,username:"",group:group[0],announ:announ,activity:activity});
                 }
            });
    }
    else
    {
        res.redirect('/');
    } 
});

router.get('/grouppage',function(req,res)
{
    async.waterfall(
        [
    function(cb)
    {
     db.Search("group","Name",req.query.name,function(err,data)
     {
         cb(err,data);
     });  
    },
    function(group,cb)
    {
     db.Search("announ","Group",group[0].Name,function(err,data)
     {
         cb(err,group,data);
     });
    },
    function(group,announ,cb)
    {
        db.Search("activity","Group",group[0].Name,function(err,data)
        {
            cb(err,group,announ,data);
        });
    }
 ]
 ,
 function(err,group,announ,activity)
 {
      if(err) {console.log(err.message);}
      else
      {
         if(req.session.username) res.render('group',{isLogin:true,username:req.session.username,group:group[0],announ:announ,activity:activity}); 
         else res.render('group',{isLogin:false,username:"",group:group[0],announ:announ,activity:activity});
      }
 });
}

);

module.exports = router;