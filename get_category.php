<?php
$url='http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=6749891ba2686b1460a02299a0929298';
try{
	$xml=new SimpleXMLElement($url,null,true);
	header("Content-Type: application/xml;charset=utf-8");
	echo($xml->asXML());
}catch(Exception $e){
	echo $e->getMessage();
}
