var express = require('express');
var router = express.Router();
var db=require('./dataBase');
var cookie=require('cookie-parser'); //cookie中间件
var async=require('async');
var fs = require('fs');

router.get('/apply',function(req,res)
{
    async.waterfall(
        [
           function(cb)
           {
               db.Search("venue","Name",req.query.address,function(err,data)
               {
                if(err) console.log(err.message);   
                if(data[0]==null)
                   {
                        res.send(400,"位置不存在");
                        cb({message:"位置不存在"},data);
                   }
                    else if(data[0].Number==data[0].Max)
                    {
                        res.send(200,预约已满);
                        cb({message:"预约已满"},data);
                    }
                    else cb(err,data[0]);
               });
           },
           function(venue,cb)
           {
               
               if(req.session.username) db.Search("user","Name",req.session.username,function(err,data)
               {
                   if(err) console.log(err.message);
                   if(data[0]==null)
                   {
                    res.send(200,"找不到该用户");
                    cb({message:"找不到该用户"},venue,null);
                   }
                   else if(data[0].Group==null)
                   {
                       res.send(200,"请先加入/创建社团");
                       cb({message:"请先加入/创建社团"},venue,data);}
                   else cb(err,venue,data[0]);
               });
               else {
                   res.send(200,"请先登录");
                cb({message:"请先登录"},venue,null);   
                }
           },function(venue,user,cb)
            {
            db.Search("group","Name",user.Group,function(err,data)
            {
                if(err) console.log(err.message);
                else cb(err,venue,data[0]);
            });
            },
            function(venue,group,cb)
            {
                db.Search("activity","Name","*",function(err,data)
                {
                    if(err) console.log(err.message);
                    else 
                    {
                        db.InsertActivity(Object.keys(data).length+1,group.Name,req.query.name,0,req.query.address,req.query.description,req.query.start,req.query.end);
                        cb(err,venue,group);
                    }
                });
                
            },
            function(venue,group,cb)
            {
                 db.Modify("venue",venue.Id,"Number",venue.Number+1);
                 if(venue.Number+1==venue.Max) db.Modify("venue",venue.Id,"Status","满员");
                 cb(null);
            }
        ],function(err)
        {
            if(err) console.log(err.message);
            else res.send(200,"预约成功！");
        }
        );
});



router.get('/delete',function(req,res)
{
    async.waterfall(
        [
            function (cb) {
                db.Search("activity", "Id", req.query.Id, function (err, data) {
                    if (err) {
                        res.send(400, err);
                        console.log(err.message);
                    }
                    else if (data[0] == null) {
                        res.send(200, { message: "活动不存在" });
                    }
                    else {
                       cb(err,data[0]);
                    }
                });
                  }
                 ,function(activity,cb)
                  {
                      db.Search("user","Name",req.session.username,function(err,data)
                      {
                      if(err)
                      {
                          res.send(400,err);
                          console.log(err.message);
                      }
                      else if(data[0]==null)
                      {
                          res.send(200,{message:"用户不存在！"})
                      }
                      else if(data[0].Group==null)
                      {
                          res.send(200,{message:"请先加入社团！"})
                      }
                      else cb(err,activity,data[0]);
                      })
                  },
                  function(activity,user,cb)
                  {
                       db.Search("group","Name",user.Group,function(err,data)
                       {
                            if(err)
                            {
                                res.send(400,err);
                                console.log(err.message);
                            }
                            else if(data[0]==null)
                            {
                                res.send(200,{message:"社团不存在！"})
                            }
                            else if(data[0].Name!=activity.Group)
                            {
                                res.send(200,{message:"没有权限！"})
                            }
                            else cb(err,activity,data[0]);
                       });
                  },
                  function(activity,group,cb)
                  {
                      db.Search("venue","Name",activity.Place,function(err,data)
                      {
                         if(err)
                         {
                             res.send(400,err);
                             console.log(err,message);
                         }
                         else if(data[0]==null)
                         {
                            res.send(200,{message:"地点不存在！"})
                         }
                         else cb(err,action,data[0]);
                      });
                  },
                   function(activity,venue,cb)
                   {
                       db.Delete("activity",activity.Id);
                       db.Modify("venue",venue.Id,"Number",venue.Number+1);
                       cb(null);
                   }
              ],function(err)
              {
                  if(err) console.log(err);
                  else res.send(200,"删除成功");
              }
              );
              
});

router.get('/',function(req,res)
{
    if(req.query.name=="")
{
    db.Search("venue","Name","*",function(err,data){
        if(err) res.send(400,err);
        else if(req.session.username){res.render('activity',{isLogin:true,username:req.session.username,venue:data});}
        else res.render('activity',{isLogin:false,username:"",venue:data});
    });
}else db.Search("venue","Name",req.query.name,function(err,data){
    if(err) res.send(400,err);
    else {if(req.session.username){res.render('activity',{isLogin:true,username:req.session.username,venue:data});}
    else res.render('activity',{isLogin:false,username:"",venue:data});}
});
    
});

module.exports = router;