var express = require('express') //node.js express框架模块导入
var path = require('path');  //系统路径
var ejs=require('ejs');  //html渲染引擎，对前端很重要
var mysql  = require('mysql');  //mysql解析模块
var url =require('url');     //url解析
var fs = require('fs');      //文件解析
var nodemailer=require('nodemailer');//发送邮件
var multipart = require('connect-multiparty');
var multer  = require('multer');
var cookie=require('cookie-parser'); //cookie中间件
var session=require('express-session');//session中间件



/*
用户限流的思路（记录用），给服务器设置一个定时器，以20秒为一个周期，每个周期结束后删除所有访问限制，如果某个用户访问超过五次就上锁
*/

var util=require('util')

var app=new express();

var homeRouter=require('./routes/home');
var loginRouter = require('./routes/login'); 
var registerRouter=require('./routes/register');
var modifyRouter=require('./routes/modifyPassword');
var adminRouter=require('./routes/admin');
var announceRouter=require('./routes/announ');
var groupRouter=require('./routes/group');
var activityRouter=require('./routes/activity');
var pwdmodifyRouter=require('./routes/modifyPassword');
var userpgRouter=require('./routes/userpage');
var activitypgRouter=require('./routes/ActivityPage');
var announpgRouter=require('./routes/AnnounPage');

var accessRecord=new Map(); //这是一个Map类型，用于存储键值对

var blackList={};//暂时黑名单

var indexs=0;

app.set('views','./views/pages');

app.engine('html',ejs.__express);

app.set('view engine','ejs');

var upload=multer({dest: 'upload_tmp/'});

app.use(cookie());
app.use(session({
    secret: 'Ancaeus',
    resave: false,
    saveUninitialized: true,
    cookie:
    {
      maxAge:5000000
    },
    rolling:true
}))


app.use(express.static(path.join(__dirname, 'public/CSS'))); //静态文件放在这里
app.use(express.static(path.join(__dirname, 'public/JS')));
app.use(express.static(path.join(__dirname, 'public/data')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/fonts')));
app.use(express.static(path.join(__dirname, 'public')));

app.all('*',function(req, res,next) {  //建立ip拦截器
    if(req.session.AccessCode)
    {
        req.session.AccessCode=indexs;
        indexs++;
        accessRecord.set(req.session.AccessCode,0);
        console.log(accessRecord.get(req.session.AccessCode));
    }
    
    accessRecord.set(req.session.AccessCode,accessRecord.get(req.session.AccessCode)+1);

    if(accessRecord.get(req.session.AccessCode)>200)
    {
        res.render('buzy');//锁掉
        blackList.push({"AccessCode":req.session.AccessCode,"Time":Date.now()});
        var restoreAccess=function()
        {
            for(var i=0;i<blackList.length;i++){
            if(req.session.AccessCode==blackList[i].AccessCode)
            {
               blackList.splice(i,1);
            }
            }
        }
        var release=setTimeout(restoreAccess,60000);  //计时器，每60秒放一个人出去
        return;
    }
    
    for(var i=0;i<blackList.length;i++){
            if(req.session.AccessCode==blackList[i].AccessCode)
            {
               res.render('buzy');//锁掉
               return;
            }
            }

    var ip_cutter=/(([01]{0,1}\d{0,1}\d|2[0-4]\d|25[0-5])\.){3}/; //这是一个可以提取ip'xxx.xxx.xxx.'部分的正则表达式

    var ip=req.ip;
    
    var temp=ip_cutter.exec(ip);  //切割字符串

    ip=ip.substring(temp[0].length,ip.length);

    if(parseInt(ip)%3==0)
    {
        console.log("正在跳转");
        console.log(ip);
        res.redirect(301,'http://www.hnist.cn');
    res.end();    
    }
    else next();
});

app.use('/',homeRouter);  //拦截到相应的路由文件
app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/modify',modifyRouter);
app.use('/admin',adminRouter);
app.use('/announce',announceRouter);
app.use('/group',groupRouter);
app.use('/activity',activityRouter);
app.use('/pwdmodify',pwdmodifyRouter);
app.use('/userpage',userpgRouter);
app.use('/actpage',activitypgRouter);
app.use('/announpage',announpgRouter);

app.get('/cancel',function(req,res) //注销用户
{
    req.session.destroy(function(err) {
        res.redirect('/');
    })
});


app.post('/upload_file', upload.any(), function(req, res, next) {
    console.log(req.files[0]);  // 上传的文件信息

    var des_file = "./Resource/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                response = {
                    message:'File uploaded successfully',
                    filename:req.files[0].originalname
                };
                console.log( response );
                res.end( JSON.stringify( response ) );
            }
        });
    });
});

app.use(function(req, res) {
    res.render('404NotFound');
});


app.use(function(err, req, res, next) {
    res.render('505err');
});

module.exports = app;


var server = app.listen(8888,'127.0.0.1', function ()  //建立监听，并将访问的ip地址限定为IPv4
{
 
    var host = server.address().address
    var port = server.address().port
   
    var startTime = Date.now();

    var clearAccessRecord =function(startTime){  //一个服务器周期进行一次清除
        for (let key of accessRecord.keys()) {
            accessRecord.set(key,0);
          }
     }
     var AllClear=setInterval(clearAccessRecord,20000,startTime); //20000ms=20sec，记录用户访问的计时器

    console.log("应用实例，访问地址为 http://localhost:%s",  port)
   
  })
  