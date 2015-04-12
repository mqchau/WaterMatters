
$('.dropdown-toggle').dropdown();

var wm = {};

wm.showData = function (pageName){
	$('#dataPage').show();
};


wm.getCountyData = function (){
		$.ajax({
			type: 'GET', // added,
			url: '/ajaxget',
			data: {
				functionName: "getCountyList"
			},
			success: function (data) {
				console.log(data);
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
							wm.showData();
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


// $('#homeButton').click(function(){wm.changePage("homePage")});




