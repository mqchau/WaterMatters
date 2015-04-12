
$('.dropdown-toggle').dropdown();

var wm = {};

wm.showData = function (pageName){
	$('#dataPage').show();
};


wm.getCountyData = function (countyAb){
	$.ajax({
		type: 'GET', 
		url: '/ajaxget',
		data: {
			functionName: "getCountyList",
			abbreviation: countyAb
		},
		success: function (data) {
			var countyList  = JSON.parse(data).CountyList;
			$('#myDropdownCounty').parent().show();
			for (var i = 0; i < countyList.length; i++) {
				$('#myDropdownCounty').append('<li role="presentation"><a role="menuitem" param='+i+' tabindex="-1" href="#">' + countyList[i] + '</a></li>');
			};
			for (var k = 0; k < countyList.length; k++) {
					$('#myDropdownCounty').children().eq(k).on('click', function (j) { 
						var index = j;
						return function() {
							$('#textLabelCounty').html(countyList[j])
							console.log(countyList[j]);
							wm.showData();
						};
					}(k));
			};
			$("#AjaxGetReturn").html(data);
		},
		error: function (xhr, status, error) {
			console.log('Error: ' + error.message);
		}
	});
};


wm.getStateData = function (){
		$.ajax({
			type: 'GET', // added,
			url: '/ajaxget',
			data: {
				functionName: "getStateList"
			},
			success: function (data) {
				$("#AjaxGetReturn").html(data);
				var stateList  = JSON.parse(data).StateList;
				for (var i = 0; i < stateList.length; i++) {
					$('#myDropdown').append('<li role="presentation"><a role="menuitem" param='+i+' tabindex="-1" href="#">' + stateList[i].name + '</a></li>');
				};


				for (var k = 0; k < stateList.length; k++) {
					$('#myDropdown').children().eq(k).on('click', function (j) { 
						var index = j;
						return function() {
							console.log(stateList[j].abbreviation);
							wm.getCountyData(stateList[j].abbreviation);
						};
					}(k));
				};
			},
			error: function (xhr, status, error) {
				console.log('Error: ' + error.message);
			}
		});
};

wm.getStateData();


$('#localButton').click(function(){
	$.ajax({
		type: 'POST', // added,
		url: '/login',
		data: {"data": "TEST"},
		success: function (data) {
			console.log(data);
			$('#localButton').after('<br>'+data);
			//var ret = jQuery.parseJSON(data);
			//$('#lblResponse').html(ret.msg);
			$("#LocationData").html(data);
		},
		error: function (xhr, status, error) {
			console.log('Error: ' + error.message);
			$('#lblResponse').html('Error connecting to the server.');
		}
	});
});



