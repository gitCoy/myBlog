/**
 * Created by yi@Coy on 2016/4/1.
 */
var progressDBar;
var myVideo=document.getElementById("vedio");
var dzLog=document.getElementById("dzLog");
var btnStar = document.getElementById("btnStar");
var time = document.getElementById("time");
var progressBar = document.getElementById("progressBar");
var imgV = document.getElementById("imgV");
var txtTs = document.getElementById("txtTs");
var defaultBar = document.getElementById("defaultBar");
var videoSrc = document.getElementById("videoSrc");
myVideo.onclick = (function(){
    myVideo.pause();
    btnStar.style.display = "block";
});
dzLog.onclick = (function(){
    dzLog.style.backgroundPosition = "100% 100%";
    dzLog.parentNode.nextElementSibling.style.color = "#fe3304";
    dzLog.parentNode.nextElementSibling.innerHTML = "已赞";
});
btnStar.onclick = (function(){
    btnStar.style.display = "none";
    imgV.style.display = "none";
    txtTs.style.display = "none";
    defaultBar.style.display = "block";
    myVideo.play();
    progressDBar = setInterval(progress,500);
});
if(videoSrc.getAttribute("src") == ""){
    imgV.setAttribute("src","images/tx.jpg");
    btnStar.style.display = "none";
    txtTs.style.display = "none";
    defaultBar.style.display = "none";
}else{
    myVideo.addEventListener("canplaythrough",function(){
        time.innerHTML = times(myVideo.duration);
    });
}
myVideo.addEventListener("ended",function(){
    btnStar.style.display = "block";
});
function times(value){
    var time = parseInt(value);
    var m, s,result;
    if(time > 60){
        m = parseInt(time/60);
        s = parseInt(time%60);
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        result = m + ":" + s;
        return result;
    }else{
        return "00:" + time;
    }
}
function progress(){
    if(!myVideo.ended){
        var size = parseInt(myVideo.currentTime*myVideo.clientWidth/myVideo.duration);
        progressBar.style.width = size + "px";
        progressBar.style.borderRight = "6px solid #ffac7b";
    }else{
        progressBar.style.width = 0 + "px";
        progressBar.style.borderRight = "0";
        window.clearInterval(progressDBar);
    }
}
