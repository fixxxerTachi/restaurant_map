//ドロップダウンメニュー
jQuery(function(){

$("nav ul ul").hide();

$("nav li").hover(function(){
$("ul:not(:animated)",this).slideDown("fast");
},

function(){
$("ul",this).slideUp("fast");
});

});


//パンくずリスト(IE8対策)
jQuery(function(){
if(!jQuery.support.opacity){
for(i = 0; i <= 10; i++) {
zIndexNum = 20 - i;
$("#breadcrumbs a:eq("+i+")").css("zIndex",zIndexNum);
}
}
});





