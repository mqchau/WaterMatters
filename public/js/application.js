
$('.dropdown-toggle').dropdown();


var usageDataLabels =["Aquaculture","DomesticUsageFreshWater","Industrial","Irrigation","IrrigationCrop","Livestock","Mining"
,"PublicSupply","ThermalElectric","ThermalElectricOneThrough","ThermalElectricRecirculation"];
var resourceDataLabels =["TotalFreshWater","TotalGroundWater"];

var wm = {};

wm.showData = function (pageName){
	$('#dataPage').show();
};


wm.getCountyData = function (stateAb){
	$.ajax({
		type: 'GET', 
		url: '/ajaxget',
		data: {
			functionName: "getCountyList",
			abbreviation: stateAb
		},
		success: function (data) {
			var countyList  = JSON.parse(data).CountyList;
			$('#myDropdownCounty').parent().show();
			$('#myDropdownCounty').empty();
			for (var i = 0; i < countyList.length; i++) {
				$('#myDropdownCounty').append('<li role="presentation"><a role="menuitem" param='+i+' tabindex="-1" href="#">' + countyList[i] + '</a></li>');
			};
			for (var k = 0; k < countyList.length; k++) {
					$('#myDropdownCounty').children().eq(k).on('click', function (j) { 
						return function() {
							$('#textLabelCounty').html(countyList[j])
							wm.showData();
							$(".loader").show();
							wm.getWaterData(stateAb,countyList[j])
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
				$('#myDropdown').empty();
				for (var i = 0; i < stateList.length; i++) {
					$('#myDropdown').append('<li role="presentation"><a role="menuitem" param='+i+' tabindex="-1" href="#">' + stateList[i].name + '</a></li>');
				};


				for (var k = 0; k < stateList.length; k++) {
					$('#myDropdown').children().eq(k).on('click', function (j) { 
						return function() {
							$('#textLabelState').html(stateList[j].name);
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
	$(".loader").show();
	$.ajax({
		type: 'GET', 
		url: '/ajaxget',
		data: {
			functionName: "getCurrentLocation"
		},
		success: function (data) {
			$("#AjaxGetReturn").html(data);
			var data =JSON.parse(data);
			console.log(data.StateAbbr,data.County)
			$('#localisationText').text('You are in ' + data.County + ' ' +data.State);
			wm.getWaterData(data.StateAbbr,data.County);
		},
		error: function (xhr, status, error) {
			console.log('Error: ' + error.message);
		}
	});
	wm.showData();
});


wm.getWaterData = function(state,county) {
	$.ajax({
		type: 'GET', 
		url: '/ajaxget',
		data: {
			functionName: "getWaterDataMongoDB",
			StateAbbr: state,
			County: county
		},
		success: function (data) {
			$("#AjaxGetReturn").html(data);
			wm.showViz1(data);
			$(".loader").fadeOut("fast");
		},
		error: function (xhr, status, error) {
			console.log('Error: ' + error.message);
		}
	});
}

wm.showViz1 = function(data) {
	var data = JSON.parse(data);
	wm.usageData = 0;
	wm.usageDataByUsage = [];
	wm.usageDataObject = [];
	for (var i = 0; i < usageDataLabels.length; i++) {
		wm.usageData = wm.usageData + data.InfoByYear[0][usageDataLabels[i]];
		wm.usageDataByUsage.push(data.InfoByYear[0][usageDataLabels[i]]);
	};
	wm.resourceData = 0;
	for (var i = 0; i < resourceDataLabels.length; i++) {
		wm.resourceData = wm.resourceData + data.InfoByYear[0][resourceDataLabels[i]];
	};

	wm.buildResourceUseViz();
	ProfileDonut.init();
};

wm.buildResourceUseViz = function() {
	wm.resourceData;
	wm.usageData;

	var svgDoc = d3.select("#dataViz1");
	$("#dataViz1").empty();
	var maxHeight = 200;
	var maxOne =Math.max(wm.resourceData, wm.usageData); 

	// var svgDoc = d3.select("#dataPage").append("svg")
 // 3                                    .attr("width", 200)
 // 4                                    .attr("height", 200);
	var resourceDiv = svgDoc.append("div")
		.style("width","50px")
		.style("height","0px")
		.style("display","inline-block")
		.style("margin-right","20px")
		.style("background-color","#56AADF")
		.transition()
		.style("height",(wm.resourceData/maxOne)*200 +"px");


	// resourceDiv.on("mouseover",function(d){
	// 	console.log(d)
	// })

	var useDiv = svgDoc.append("div")
		.style("width","50px")
		.style("height","0px")
		.style("display","inline-block")
		.style("margin-right","20px")
		.style("background-color","#DA6767")
		.transition()
		.style("height",(wm.usageData/maxOne)*200 +"px");

    svgDoc.append("span")
		.style("position","absolute")
		.style("top","-30px")
		.style("font-family","Lato")
		.style("left","25px")
		.text("Resources");

	svgDoc.append("span")
		.style("position","absolute")
		.style("top","-30px")
		.style("font-family","Lato")
		.style("left","108px")
		.text("Usage");

	svgDoc.append("span")
		.style("position","absolute")
		.style("bottom","-80px")
		.style("font-family","Lato")
		.style("left","30px")
		.text("unit mGallons/day");	

	svgDoc.append("span")
		.style("position","absolute")
		.style("bottom","-40px")
		.style("font-family","Lato")
		.style("left","40px")
		.text(Math.round(wm.resourceData*100)/100);	
	svgDoc.append("span")
		.style("position","absolute")
		.style("bottom","-40px")
		.style("font-family","Lato")
		.style("left","110px")
		.text(Math.round(wm.usageData*100)/100);

}



ProfileDonut = function() {};

ProfileDonut.init = function() {
    var width = 200,
        height = 200,
        radius = Math.min(width, height) / 2;
    var donuts = document.getElementsByClassName('profileDonut');
    $('.profileDonut').empty();
    var percents, donutElement;
    var categories=wm.usageDataLabels;
    console.log(wm.usageDataByUsage)
    var percents= wm.usageDataByUsage ;

    for (var i = 0; i < donuts.length; i++) {
        colors = JSON.parse(donuts[i].getAttribute("colors"));

        var chartCircle = d3.select(donuts[i]);
        var width = 200,
            height = 200,
            radius = Math.min(width, height) / 2;

        var arc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 20)
            .startAngle(0);

        var svg = chartCircle.append("div")
            .attr("class", "col-xs-12 col-sm-6")
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('margin', '0 auto')
            .style('display', 'block')
            .style('margin-bottom', '5px')
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        var rotate = 0;
        for (var k = 0; k < percents.length; k++) {

            var meter = svg.append('g').attr('class', 'progress-meter').datum(percents[k] / wm.usageData);
            var percentage = 0;
            meter.append('path').datum(percentage)
                .attr('class', 'foreground')
                .attr('transform', function() {
                    if (k === 0) {
                        rotate = rotate + 0;
                    } else {
                        rotate = rotate + 360 * (percents[k - 1] / wm.usageData);
                    }
                    return 'rotate(' + rotate + ')';
                })
                .attr('d', function(d) {
                    return arc.endAngle(2 * Math.PI * d)();
                })
                .each(function(d) {
                    this._current = d;
                });

            percentage = percents[k] / wm.usageData;
            meter.select('path.foreground').datum(percentage)
                .transition().duration(750)
                .attrTween('d', function(d) {
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc.endAngle(2 * Math.PI * interpolate(t))();
                    };
                })
                .style('fill', '#'+Math.floor(Math.random()*16777215).toString(16))
                .each(function(d) {
                    this._final = d;
                });


            meter.append('text').datum(percentage)
                .attr('text-anchor', 'middle')
                .attr('class', 'fa fa-user')
                .attr('y', 13)
                .style('font-family', 'Lato')
                .style('font-size', '30px')
                .style('font-weight', '900')
                .style('fill', colors[k])
                .text(function(d) {
                    return Math.floor(d * 100) + ' %';
                })
                .style('display', 'none');

            meter.on('mouseover', function(d) {
                d3.select(this).select('text').style('display', 'block');
                d3.select(this).select('path.foreground')
                    .transition().duration(500)
                    .attr('d', function() {
                        return arc.innerRadius(radius - 15)
                            .endAngle(2 * Math.PI * d)();
                    });
                 $('.profileDonutLabel').empty();
                 $('.profileDonutLabel').html(usageDataLabels[wm.usageDataByUsage.indexOf(d*wm.usageData)]);
            });

            meter.on('mouseout', function() {

                d3.select(this).select('text').style('display', 'none');
                d3.select(this).select('path.foreground')
                    .transition().duration(500)
                    .attr('d', function(d) {
                        return arc.innerRadius(radius - 20)
                            .endAngle(2 * Math.PI * d)();
                    });
            });
        }



    };
}

$(document).ready(function(){
	//hide the loader in the begining
	$(".loader").hide();	
});
