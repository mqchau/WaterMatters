$('.dropdown-toggle').dropdown()

$('#myDropdown').children().on('click', function () {
  console.log("55555")
})



var wm = {};

wm.getCountyData = function (){
		$.ajax({
			type: 'POST', // added,
			url: '/login',
			data: {"data": "getCountyData"},
			success: function (data) {
				console.log(data);
			},
			error: function (xhr, status, error) {
				console.log('Error: ' + error.message);
			}
		});
};


wm.getStateData = function (){
		$.ajax({
			type: 'POST', // added,
			url: '/login',
			data: {"data": "getStateData"},
			success: function (data) {
				console.log(data);
			},
			error: function (xhr, status, error) {
				console.log('Error: ' + error.message);
			}
		});
};