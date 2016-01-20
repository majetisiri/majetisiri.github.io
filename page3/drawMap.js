function p(name){
	return function(d){ return d[name]; }
}
function toPositiveRadian(r){ return r > 0 ? r : r + Math.PI*2; }
function toDegree(r){ return r*180/Math.PI; }


var abv;
var selectedState=-1;
var width = 960,
	height = 600,
	centered;
	zoomRender = false;

var proj = d3.geo.azimuthalEqualArea()
    .scale(width)
    .translate([33.5, 262.5])
    .rotate([100, -45])
    .center([-17.6076, -4.7913]) // rotated [-122.4183, 37.7750]
    .scale(1297);

var path = d3.geo.path().projection(proj);


var svg = d3.select("#map").append("svg")
		.attr("width", width)
		.attr("height", height)

var g = svg.append("g");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([30, 0])
  .html(function(d) {
    return "<strong>State: </strong> <span style='color:red'>" +d.properties.name + "</span>";
  });
svg.call(tip);




function clicked(d) {

	d3.select("#fscale-chart").selectAll("svg").remove();

  if (d && centered !== d) {
    centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1] - 40;
    k = (d.id == "48" || d.id == "06") ? 2 : 4;
    centered = d;

    popup();
   
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
   

  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition().duration(500)
  	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");

  d3.selectAll(".border")
    .transition().duration(500).style("stroke-width", .25 / k + "px");

  g.selectAll("path")
    .classed("active", centered && function(d) { return d === centered; });

   zoomRender = true;
}

var stateNameToAbv = {"Alabama":"AL","Alaska":"AK","American Samoa":"AS","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","District Of Columbia":"DC","Federated States Of Micronesia":"FM","Florida":"FL","Georgia":"GA","Guam":"GU","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Marshall Islands":"MH","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Northern Mariana Islands":"MP","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Palau":"PW","Pennsylvania":"PA","Puerto Rico":"PR","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virgin Islands":"VI","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"};

var widthScale = d3.scale.pow().exponent(.5);
var colorScale = d3.scale.linear();
var opacityScale = d3.scale.quantile();

var parseDate = d3.time.format("%x %H:%M").parse;

queue()
	.defer(d3.json, "us-states.json")
	.defer(d3.csv, "temp.csv")
	.defer(d3.json, "us.json")
	.await(intialLoad);








function popup(){




var margin = {top: 10, right: 60, bottom: 20, left: 0},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var parse = d3.time.format("%b %Y").parse;

// Scales and axes. Note the inverted domain for the y-scale: bigger is up!
var x = d3.time.scale().range([0, width]),
//    y = d3.scale.linear().range([height, 0]),
    xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
  //  yAxis = d3.svg.axis().scale(y).ticks(4).orient("right");


var y = d3.scale.log().domain([100, 1e6]).range([height,0]);
var yAxis = d3.svg.axis().orient("right").scale(y).ticks(40, d3.format(",d"));



	
// An area generator, for the light fill.
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });
	

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });


//console.log("selectedState: "+selectedState);

var fileName = "";
var cityName = "";
if(selectedState==9){
	fileName = "1.csv";
	cityName="Atlanta";
}else if(selectedState==19){
	fileName = "2.csv";
	cityName="Baltimore";
}else if(selectedState==17){
	fileName = "3.csv";
	cityName="Baton Rouge";
}else if(selectedState==0){
	fileName = "4.csv";
	cityName="Birmingham";
}else if(selectedState==31){
	fileName = "5.csv";
	cityName="Buffalo";
}else if(selectedState==41){
	fileName = "6.csv";
	cityName="Cleveland";
}else if(selectedState==21){
	fileName = "7.csv";
	cityName="Detroit";
}else if(selectedState==5){
	fileName = "8.csv";
	cityName="Hartford";
}else if(selectedState==13){
	fileName = "9.csv";
	cityName="Indianapolis";
}else if(selectedState==8){
	fileName = "10.csv";
	cityName="Miami";
}else if(selectedState==24){
	fileName = "1.csv";
	cityName="Kansas City";
}else if(selectedState==2){
	fileName = "2.csv";
	cityName="Little Rock";
}else if(selectedState==29){
	fileName = "3.csv";
	cityName="Newark";
}else if(selectedState==3){
	fileName = "4.csv";
	cityName="Oakland";
}else if(selectedState==37){
	fileName = "11.csv";
	cityName="Philadelphia";	
}else if(selectedState==7){
	fileName = "2.csv";
	cityName="DC";	
}else if(selectedState==12){
	fileName = "7.csv";
	cityName="Rockford";	
}
if(fileName==""){

		var svg = d3.select("#fscale-chart").append("svg")
		.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
		  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("fill","white");

      svg.append("text").attr("dy", ".35em").attr("dx", ".35em")
    .attr("opacity", "1").text("Not in Top 25 cities");

	return;

}


d3.csv(fileName, type, function(error, data) {

  // Filter to one symbol; the S&P 500.
  var values = data.filter(function(d) {
    return d.symbol == "income";
  });

  var msft = data.filter(function(d) {
    return d.symbol == "population";
  });

  var ibm = data.filter(function(d) {
    return d.symbol == 'crime';
  });

 

  // Compute the minimum and maximum date, and the maximum price.
  x.domain([values[0].date, values[values.length - 1].date]);
  //y.domain([0, d3.max(values, function(d) { return d.price; })]).nice();
  

  // Add an SVG element with the desired dimensions and margin.

    

var svg = d3.select("#fscale-chart").append("svg")
		.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
		  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("fill","white");

      svg.append("text").attr("dy", ".35em").attr("dx", ".35em")
    .attr("opacity", "1").text(cityName);
/*
  var svg = d3.select("svg")  
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("fill","white");
*/
  // Add the clip path.
  svg.append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill","white");

  // Add the x-axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .style("fill","white");

  // Add the y-axis.
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxis)
      .style("fill","white");





  var colors = d3.scale.category10();
  svg.selectAll('.line')
    .data([values, msft, ibm])
    .enter()
      .append('path')
        .attr('class', 'line')
        .style('stroke', function(d) {
          return colors(Math.random() * 50);
        })
        .attr('clip-path', 'url(#clip)')
        .attr('d', function(d) {
          return line(d);
        })


  /* Add 'curtain' rectangle to hide entire graph */
  var curtain = svg.append('rect')
    .attr('x', -1 * width)
    .attr('y', -1 * height)
    .attr('height', height)
    .attr('width', width)
    .attr('class', 'curtain')
    .attr('transform', 'rotate(180)')
    .style('fill', '#ffffff')

  /* Optionally add a guideline */
  var guideline = svg.append('line')
    .attr('stroke', '#333')
    .attr('stroke-width', 1)
    .attr('class', 'guide')
    .attr('x1', 1)
    .attr('y1', 1)
    .attr('x2', 1)
    .attr('y2', height)

  /* Create a shared transition for anything we're animating */
  var t = svg.transition()
    .delay(750)
    .duration(6000)
    .ease('linear')
    .each('end', function() {
      d3.select('line.guide')
        .transition()
        .style('opacity', 1)
        .attr('stroke-width', 10)
        .remove()
    });

  t.select('rect.curtain')
    .attr('width', 1);
  t.select('line.guide')
    .attr('transform', 'translate(' + width + ', 0)')



guideline.attr('stroke-width', 3);
    curtain.attr("opacity", 0);



// draw legend
  var legend = svg.selectAll(".legend")
      .data(colors.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-60," + (i+0) * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colors);

  // draw legend text

//  
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size","12px")
      .style("fill","white")
       .text(function(d, i) {
          if(i==0){
            return "Income";
          }
          if(i==1){
            return "Population";
          }
          if(i==2){
            return "Crime Rate";
          }
        ; });

});

// Parse dates and numbers. We assume values are sorted by date.
function type(d) {
  d.date = parse(d.date);
  d.price = +d.price;
  return d;
}


}


function intialLoad(error, topology, tornados, usGrey){


	tornados.forEach(function(t, i){
		['inj', 'fat', 'elat', 'elon', 'slat', 'slon', 'fscale', 'length', 'width'].forEach(function(field){
			t[field] = +t[field];});
		t['index'] = i;
		t['time'] = parseDate(t['time']);

		t['x1'] = proj([t.slon, t.slat])[0];
		t['y1'] = proj([t.slon, t.slat])[1];
		t['x2'] = proj([t.elon, t.elat])[0];
		t['y2'] = proj([t.elon, t.elat])[1];

		t['angle'] = Math.atan2(t.x2 - t.x1, -(t.y2 - t.y1));
		t['angle'] = toDegree(toPositiveRadian(t['angle']));
	});

	//remove those w/o angle
	tornados = tornados.filter(function(d){ return d.angle != 180; });

	vtornados = tornados.filter(function(d){ return d.length > 20; });

	widthScale.range([.25, 2.6])
	    .domain(d3.extent(vtornados.map(function(d){ return d.width; })));
	colorScale.range(['blue', 'red'])
			.domain(d3.extent(vtornados.map(function(d){ return d.fscale; })));
	opacityScale.range(d3.range(.3, .8, .1))
	    .domain(vtornados.map(function(d){ return d.fscale; }));

	var defs = g.append("defs");

	defs.append("path")
	  .datum(topojson.feature(usGrey, usGrey.objects.land))
	  .attr("id", "land")
	  .attr("d", path);

	g.append("clipPath")
	  .attr("id", "clip")
	.append("use")
	  .attr("xlink:href", "#land");

	g.append("image")
	  .attr("clip-path", "url(#clip)")
	  .attr("xlink:href", "shaded-relief.png")
	  .attr("width", width)
	  .attr("height", height);

	g.append("use")
	  .attr("xlink:href", "#land");

	stateBorders = g.selectAll(".border")
		.data(topology.features)
	.enter()
		.append("svg:path")
		.attr("d", path)
		.attr("class", "border")
		.on("click", function(d,i){ 
			abv = stateNameToAbv[d.properties.name];
			
			

			selectedState = i;

			clicked(d);
			state.filter( function(stateList){ 
				if(centered == null){ return true; }
				return stateList.indexOf(abv) != -1;
			});
			setTimeout(renderAll, 500); 
		}) 
		 .on('mouseover', tip.show)
      		.on('mouseout', tip.hide);


	lines = g.selectAll("line").data(vtornados).enter().append("line")
			.attr("x1", p('x1'))
			.attr("y1", p('y1'))
			.attr("x2", p('x1'))
			.attr("y2", p('y1'))
			.attr("stroke-width", function(d){ return d.width; })
			//.attr("id", function(d, i){ return "TNum" + i; })
			.attr("stroke", function(d){ return colorScale(d.fscale); })
			.attr("opacity", function(d){ return opacityScale(d.fscale); })
			.attr("stroke-linecap", "butt")
			.style("pointer-events", "none")

	lines.transition().duration(3000)
			.attr("x2", function(d){ return d.x2 })
			.attr("y2", function(d){ return d.y2; })


	tornadoCF = crossfilter(tornados);
	all = tornadoCF.groupAll();

	tornadoIndex = tornadoCF.dimension(function(d){ return d.index; });
	tornadoIndexs = tornadoIndex.group();

	state = tornadoCF.dimension(function(d){ return d.states; });
	states = state.group();



	fscale = tornadoCF.dimension(function(d){ return d.fscale; });
	fscales = fscale.group();

	hour = tornadoCF.dimension(function(d){ return d.time.getHours(); });
	hours = hour.group();

	month = tornadoCF.dimension(function(d){ return d.time.getMonth(); });
	months = month.group();

	year = tornadoCF.dimension(function(d){ return Math.floor(d.time.getFullYear()/1)*1; });
	years = year.group();

	var Wlb = 2.3;
	tWidth = tornadoCF.dimension(function(d){ return d.width; });
	widthLogs = tWidth.group(function(d, i){ 
	 return Math.pow(Wlb, Math.floor(Math.log(d + 1)/Math.log(Wlb))); });	

	var Llb = 1.8;
	length = tornadoCF.dimension(function(d){ return d.length; });
	//lengths = length.group(function(d, i){ return d3.round(d, -1); });
	lengthLogs = length.group(function(d, i){ 
	 return Math.pow(Llb, Math.floor(Math.log(d + 1)/Math.log(Llb))); });
	
	var Ilb = 2;
	injury = tornadoCF.dimension(function(d){ return d.inj; });
	injurys = injury.group(function(d, i){ 
	 return Math.pow(Ilb, Math.floor(Math.log(d + 1)/Math.log(Ilb))); });

	angle = tornadoCF.dimension(function(d){ return d.angle; });
	angles = angle.group(function(d, i){ return d3.round(d); });

	
var bCharts = [
		barChart()
			.dimension(fscale)
			.group(fscales)
			.x(d3.scale.linear()
				.domain([0, 5.8])
				.rangeRound([0, 130]))
			.barWidth(10),

		barChart()
			.dimension(tWidth)
			.group(widthLogs)
			.tickFormat(function(d){ return d3.format('.0f')(d-1); }, 3)
			.x(d3.scale.log().base([Wlb])
				.domain([1, 70 +  d3.max(widthLogs.all().map(function(d, i){ return d.key; }))])
				.rangeRound([0, 190]))
			.barWidth(10),

		barChart()
			.dimension(length)
			.group(lengthLogs)
			.tickFormat(function(d){ return d3.format('.0f')(d-1); })			
			.x(d3.scale.log().base([Llb])
				.domain([1, 60 + d3.max(lengthLogs.all().map(function(d, i){ return d.key; }))])
				.rangeRound([0, 190]))
			.barWidth(10),

		barChart()
			.dimension(injury)
			.group(injurys)
			.tickFormat(function(d){ return d3.format('.0f')(d-1); })			
			.x(d3.scale.log().base([Ilb])
				.domain([1, 500+  d3.max(injurys.all().map(function(d, i){ return d.key; }))])
				.rangeRound([0, 200]))
			.barWidth(10),	

		barChart()
			.dimension(year)
			.group(years)
			.tickFormat(d3.format(''))
			.x(d3.scale.linear()
				.domain([2005, 2013])
				.rangeRound([0,210]))
			.barWidth(1)
		];


	d3.selectAll("#total")
			.text(tornadoCF.size());

	function render(method){
		d3.select(this).call(method);
	}

	var oldFilterObject = {};
	tornadoIndexs.all().forEach(function(d){ oldFilterObject[d.key] = d.value; });

	renderAll = function(){
		//bChart.each(render);
		

		zoomRender = false;

		newFilterObject = {};
		tornadoIndexs.all().forEach(function(d){ newFilterObject[d.key] = d.value; });

		//exit animation
		lines.filter(function(d){ return oldFilterObject[d.index] > newFilterObject[d.index]; })
				.transition().duration(1400)
					.attr("x1", function(d){ return d.x2; })
					.attr("y1", function(d){ return d.y2; })
				.transition().delay(1450).duration(0)
					.attr('opacity', 0)
					.attr("x1", function(d){ return d.x1; })
					.attr("y1", function(d){ return d.y1; })
					.attr("x2", function(d){ return d.x1; })
					.attr("y2", function(d){ return d.y1; });

		//enter animation
		lines.filter(function(d){ return oldFilterObject[d.index] < newFilterObject[d.index]; })
					.attr('opacity', function(d, i){ return opacityScale(d.fscale); })
				.transition().duration(1400)
					.attr("x2", function(d){ return d.x2; })
					.attr("y2", function(d){ return d.y2; })

		oldFilterObject = newFilterObject;
		
		// update dealths/distance/ect
		/*
		visable = tornados.filter(function(d){ return newFilterObject[d.index] == 1; });
		d3.select("#num").text(
			d3.format(',')(all.value()));
		d3.select("#miles").text(
			d3.format(',.0f')(d3.sum(visable.map(function(d, i){ return d.length; }))));
		d3.select("#inj").text(
			d3.format(',')(d3.sum(visable.map(function(d, i){ return d.inj; }))));
		*/

	}


	window.breset = function(i){
		bCharts[i].filter(null);
		zoomRender = true;
		renderAll();
	}
	window.creset = function(i){
		cCharts[i].filter(null);
		zoomRender = true;
		renderAll();
	}


	var bChart = d3.selectAll(".bChart")
			.data(bCharts)
			.each(function(chart){ chart.on("brush", renderAll).on("brushend", renderAll) });
	
	

	renderAll();

	//remove extra width ticks (there is a better way of doing this!)
	d3.select('#width-chart').selectAll('.major')
			.filter(function(d, i){ return i % 2; })
		.selectAll('text')
			.remove();

	d3.select('#inj-chart').selectAll('.major')
			.filter(function(d, i){ return !(i % 2); })
		.selectAll('text')
			.remove();



}
