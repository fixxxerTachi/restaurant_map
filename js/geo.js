function detectBrowser(){
	var useragent=navigator.userAgent;
	if(useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') !=-1 || useragent.indexOf('iPad') != -1){
		navigator.geolocation.watchPosition(
			function(position){
				var lat=position.coords.latitude;
				var lng=position.coords.longitude;
				var latlng=new google.maps.LatLng(lat,lng);
				var geocoder=new google.maps.Geocoder();
				geocoder.geocode({'latLng':latlng},function(results,status){
					if(status==google.maps.GeocoderStatus.OK){
						if(results){
							document.getElementById('city').value=results[1].formatted_address.replace('日本,','');
							showMap();
						}
					}else{
						alert('データを取得できません');
					}
				});
			}
		);
	}else{
		document.getElementById('city').value='栃木県宇都宮市';
		showMap();
	}
}
function showMap(){
	var val=document.getElementById('city').value;
	var category;
	var address;
	var offset=1;
	$.cookie('category',$('select').val());
	$.cookie('address',$('#city').val());
	if($.cookie('category')){
		category=$.cookie('category');
	}else{
		category=$('select').val();
	}
	if($.cookie('address')){
		address=$.cookie('address');
	}else{
		address=$('citiy').val();
	}
	if($.cookie('offset')){
		offset=$.cookie('offset');
	}
	//var category=$('select').val();
	$('select').val()==category;
	$('#city').val()==address;
	get_category($('input[type=text]'),category);
	var reg=/^.+市|区|町|村/;
	var citis=val.match(reg);
	if(!citis){
		alert('市区町村を入力してください');
		return;
	}
	var geocoder;
	var map;
	geocoder=new google.maps.Geocoder();
	var mapOptions={
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map=new google.maps.Map(document.getElementById('mymap'),mapOptions);
	geocoder.geocode({'address':val},function(results,status){
		if(status==google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
			var marker=new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				title: val 
			});
			////start getAddress();

			//var offset=getParam();
			$.get('xml.php',{address:citis[0],offset:offset,category:category}).done(function(data,statusText,jqXHR){
				var shoparr=new Array();
				$('#info p').remove();
				$('#info').append('<p id="message">' + $('total_hit_count',data).text() + '件の店舗が見つかりました' + '</p>');
				pagination(data,citis[0],category,offset);	
				$.each($('rest',data),function(k,v){
					var lat=$('latitude',v).text();
					var long=$('longitude',v).text();
					var url=$('url',v).text();
					var name=$('name',v).text();
					var link='<a href="' + url + '" target="_blank">' + name + '</a>';
					shoparr.push({lat:lat,long:long,link:link,name:name});
				});
				for(n=0;n<shoparr.length;n++){
					var location=new google.maps.LatLng(shoparr[n].lat,shoparr[n].long);
					var shop_marker=new google.maps.Marker({
						map: map,
						position: location,
						title: shoparr[n].name,
						//icon:'http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png',
						icon:'http://maps.google.com/mapfiles/kml/pal2/icon32.png',
					});
					attachMessage(map,shop_marker,shoparr[n].link);
				}
			});
			////end getAddress
		}else{
			alert('情報がありません');
		}
	});
}
function attachMessage(map,mker,msg){
	google.maps.event.addListener(mker,'click',function(event){
		var info=new google.maps.InfoWindow({
			content:msg
		})
		info.open(map,mker);
	});
}
function pagination(data,address,category,offset){
	$('#page a').remove();
	var page_count=$('total_hit_count',data).text() / 200;
	for(var i=1; i<=Math.ceil(page_count); i++){
		//var url="<a href='?address=" + address + "&offset=" + i + "&category=" + category + "'>" + i + "</a>";
		var url="<li><a href='javascript:void(0)' id=" + i + ">" + i + "</a></li>";
		if(i == offset){
			url="<li class='active'><a href='javascript:void(0)' id=" + i + ">" + i + "</a></li>";
		}
		$('#page ul').append(url);
	}	
}

function getParam(){
	var url=location.href;
	if(location.search){
		parameters=url.split('?');
		params=parameters[1].split('&');
		var paramsArray=[];
		for(i=0; i<params.length; i++){
			neet=params[i].split('=');
			paramsArray.push(neet[0]);
			paramsArray[neet[0]]=neet[1];
		}
		var offset=paramsArray['offset'];
		if(offset){
			return offset;
		}else{
			return 1;
		}
	}else{
		return 1;
	}
}

function get_category(dom,category){
	var url='get_category.php';
	$.get(url,function(data){
		var categories=$('category_l',data);
		var category_length=categories.length;
		var parent=$('<select name="category" class="form-control"></select>');
		parent.append('<option value=0>すべての飲食店</option>');
		for(var i=0; i < category_length; i++){
			var code=$('category_l_code',categories[i]).text();
			var name=$('category_l_name',categories[i]).text();
			if(code==category){
				var child="<option value=" + code + " selected>" + name + "</option>";
			}else{
				var child="<option value=" + code + ">" + name + "</option>";
			}
			parent.append(child);
		}
		if(dom.has($('select'))){
			$('select').remove();
		}
		dom.after(parent);
	});
}
window.onload=detectBrowser;
$('#btn').click(function(){
	$.cookie('offset','');
	showMap();
});
$('#page a').live('click',function(e){ 
	$.cookie('offset',$(this).attr('id'));
	showMap();
});

