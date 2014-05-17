<?php
$address=$_REQUEST['address'];
if(isset($_REQUEST['offset'])){
	$offset=$_REQUEST['offset'];
}else{
	$offset='';
};
if(!isset($_REQUEST['category']) || $_REQUEST['category']=='0'){
	$url='http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=6749891ba2686b1460a02299a0929298&hit_per_page=200&address='
	. $address . '&offset_page=' . $offset; 
}else{
	$category=$_REQUEST['category'];
	$url='http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=6749891ba2686b1460a02299a0929298&hit_per_page=200&address='
	. $address . '&offset_page=' . $offset . '&category_l=' . $category; 
};
try{
	$xml=new SimpleXMLElement($url,null,true);
	header("Content-Type: application/xml;charset=utf-8");
	echo($xml->asXML());
}catch(Exception $e){
	echo $e->getMessage();
}
