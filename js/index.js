jQuery(function(){
if($.support.cssFloat){//IE8以下では実行しない

$("nav li").prepend("<div></div>");

$("nav li").mouseover(function(){
$("div",this).not(":animated").animate({
width: "300px",
height: "300px",
margin: "-86px",
borderWidth: "0px",
}, "slow", "swing")
.animate({
width: "119px",
height: "119px",
margin: "0px",
borderWidth: "5px",
}, 500, "swing");
});

$("nav li").mouseout(function(){
$("div",this).not(":animated").animate({
width: "119px",
height: "119px",
margin: "0px",
borderWidth: "5px",
}, 500, "swing");
});

}
});
