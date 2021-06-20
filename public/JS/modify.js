function modify()
{
var request;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
      request=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
      request=new ActiveXObject('Microsoft.XMLHTTP');
    }
    
    request.onreadystatechange=function()
    {
        if (request.readyState==4 && request.status==200)
        {
          alert('修改成功');
          location.reload(true);
        }
    }

    request.open('GET','MODIFY/?Id='+'&Name='+'&Sex=',true);
    request.send();
}