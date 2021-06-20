var mysql  = require('mysql');  //mysql解析模块

var connection = mysql.createConnection({     
   host     : 'localhost',       
   user     : 'root',              
   password : '2887',       
   port: '3306',                   
   database: 'user_system' 
 }); 


 connection.connect();

/*
接口说明：除了Insert外，其他接口都是对所有数据库通用的
*/

function Modify(db,Id,Variable,Value){
  //var modifySqlParams=[Variable,Id,Value];
  console.log('UPDATE `'+db+'` SET `'+Variable+'` = \''+Value+'\' WHERE `Id`=' +Id.toString());
  connection.query('UPDATE `'+db+'` SET `'+Variable+'` = \''+Value+'\' WHERE `Id`=' +Id.toString(),function (err, result) {
   if(err){
    console.log('[MODIFY ERROR] - ',err.message);
    return;
   }
   return result;        
})
}

function Search(db,Variable,Name,callback){
   if(Name=="*")
   {
      connection.query('SELECT * FROM `'+db+'`',function (err, result) {
         if(err){
          console.log('[SEARCH ERROR] - ',err.message);
          callback({message:err.message},result);
         }
         else{
            var rresult;
            rresult= JSON.parse(JSON.stringify(result));
            callback(null,rresult);
         }
      })
   }
   else connection.query('SELECT * FROM `'+db+'` WHERE `'+Variable+'` = \''+Name+'\'',function (err, result) {
   if(err){ 
    console.log('[SEARCH ERROR] - ',err.message);
    callback({message:err.message},rresult);
   }   
   else 
   {
      var rresult;
      rresult= JSON.parse(JSON.stringify(result));
     callback(null,rresult);
   }
})
}

function Delete(db,Id)
{
   var deleteSqlParams=Id.toString();
   connection.query('DELETE FROM `'+db+'` where `Id`='+deleteSqlParams,function (err, result) {
       if(err){
        console.log('[DELETE ERROR] - ',err.message);
        return;
       }
       return result;        
   })
}

function InsertUser(Id,Name,Major,Sex,PhoneNumber,Email,Password)  //没有可以填NULL，不能不填
{
  var  addSqlParams = [Id,Name,Major,Sex,PhoneNumber,Email,Password];
  connection.query('INSERT INTO `user` (`Id`,`Name`,`Major`,`Sex`,`Phone_number`,`Email`,`Password`) VALUES(?,?,?,?,?,?,?)',addSqlParams,function (err, result) {
       if(err){ 
        console.log('[INSERT ERROR] - ',err.message);
        return;
       }
       return result;        
   })
}

function InsertGroup(Id,Name,Leader,Number,Description)  //没有可以填NULL，不能不填
{
  var  addSqlParams = [Id,Name,Leader,Number,Description];
  connection.query('INSERT INTO `group` (`Id`,`Name`,`Leader`,`Number`,`Description`) VALUES(?,?,?,?,?)',addSqlParams,function (err, result) {
       if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
       }
       return result;        
   })
}

function InsertActivity(Id,Group,Name,Number,Place,Description,Start,End)  //没有可以填NULL，不能不填
{
  var  addSqlParams = [Id,Group,Name,Number,Place,Description,Start,End];
  connection.query('INSERT INTO `activity` (`Id`,`Group`,`Name`,`Number`,`Place`,`Description`,`Start`,`End`) VALUES(?,?,?,?,?,?,?,?)',addSqlParams,function (err, result) {
       if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
       }
       return result;        
   })
}

function InsertVenue(Id,Name,Address,Number,Max,Status)  //没有可以填NULL，不能不填
{
  var  addSqlParams = [Id,Name,Address,Number,Max,Status];
  connection.query('INSERT INTO `venue`(`Id`,`Name`,`Address`,`Number`,`Max`,`Status`) VALUES(?,?,?,?,?,?)',addSqlParams,function (err, result) {
       if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
       }
       return result;        
   })
}

function InsertAnnounce(Id,Group,Author,Title,Content,Number)  //没有可以填NULL，不能不填
{
  var  addSqlParams = [Id,Group,Author,Title,Content,Number];
  connection.query('INSERT INTO `announ` (`Id`,`Group`,`Author`,`Title`,`Content`,`Number`) VALUES(?,?,?,?,?,?)',addSqlParams,function (err, result) {
       if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
       }
       return result;        
   })
}

exports.Search=Search;
exports.Modify=Modify;
exports.Delete=Delete;
exports.InsertActivity=InsertActivity;
exports.InsertAnnounce=InsertAnnounce;
exports.InsertGroup=InsertGroup;
exports.InsertUser=InsertUser;
exports.InsertVenue=InsertVenue;
