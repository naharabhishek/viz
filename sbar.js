function sbarheader() {

  var sname  = "vol";
  var index  = 0;

  function sheader(selection) {
    selection.each(function(data) {

      var interval = TIntervals[TPeriod];

      if (sname == "bob" || sname == "crr") {
          var value    = CumNormDist((data[index].CLOSE - data[index].MEAN)/(data[index].SIGMA));
      } else if (sname == "aur") {
          var value    = CumNormDist((data[index].CLOSE - data[index].AURMU)/(data[index].AURSG));
      } else if (sname == "vol") {
          var value    = Math.round(data[index].TOPIC1);
      } else if (sname == "sig") {
          var value    = Math.round(data[index].VOLATILITY);
      } else if (sname == "top3") {
          var value    = Math.round(data[index].TOPIC3);
      } else if (sname == "top4") {
          var value    = Math.round(data[index].TOPIC4);
      } else if (sname == "top5") {
          var value    = Math.round(data[index].TOPIC5);
      }

      d3.select(this).text(value);
    });
  } // sheader

  sheader.index = function(value) {
          	if (!arguments.length) return index;
          	index = value;
          	return sheader;
      	};

  sheader.sname = function(value) {
          	if (!arguments.length) return sname;
          	sname = value;
          	return sheader;
      	};
  
  return sheader;
} // sbarheader

function sbar() {

  var width = 165, height = 15, sname = "vol";
  var index  = 0;

  function sbarrender(selection) {
    selection.each(function(data) {

      var interval = TIntervals[TPeriod];

      var x = d3.scale.linear().range([0, width]);

      d3.select(this).select("svg").remove();
      var svg = d3.select(this).append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(0,0)");

      if (sname == "bob" || sname == "crr") {
          x.domain([data[index].MEAN - data[index].SIGMA*2,
                    data[index].MEAN + data[index].SIGMA*2]).nice();
      } else if (sname == "aur") {
          x.domain([data[index].AURMU - data[index].AURSG*2,
                    data[index].AURMU + data[index].AURSG*2]).nice();
      } else if (sname == "vol") {
          x.domain([0, 100]).nice();
      } else if (sname == "sig") {
          x.domain([0, 100]).nice();
      } else if (sname == "top3") {
          x.domain([0, 100]).nice();
      } else if (sname == "top4") {
          x.domain([0, 100]).nice();
      } else if (sname == "top5") {
          x.domain([0, 100]).nice();
      }

  
      var voldet = svg.selectAll("."+sname+"bar")
          .data([data[index]])
        .enter().append("g")
          .attr("class", sname+"bar");
      
      voldet.selectAll("."+sname+"fill")
          .data(function(d) { return [d]; })
        .enter().append("rect")
          .attr("class", sname+"fill")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", function(d) { return (sname=="vol")?x(d.TOPIC1):(sname=="sig")?x(d.VOLATILITY):(sname=="top3")?x(d.TOPIC3):(sname=="top4")?x(d.TOPIC4):(sname=="top5")?x(d.TOPIC5): x(d.CLOSE);})
          .attr("height", height);
      
    });
  } // sbarrender

  sbarrender.sname = function(value) {
          	if (!arguments.length) return sname;
          	sname = value;
          	return sbarrender;
      	};
  
  sbarrender.index = function(value) {
          	if (!arguments.length) return index;
          	index = value;
          	return sbarrender;
      	};

  return sbarrender;
} // sbar

function CumNormDist(x) { 
    var b1        = 0.319381530;
    var b2        = -0.356563782;
    var b3        = 1.781477937;
    var b4        = -1.821255978;
    var b5        = 1.330274429;
    var p         = 0.2316419;
    var c         = 0.39894228;
    var t         = 0;
    var nd        = 0;
    if (x >= 0) {
        t         = 1/(1 + p * x);
        nd        = (1-c*Math.exp(-x*x/2)*t*(t*(t*(t*(t*b5+b4)+b3)+b2)+b1));
    } else {
        t         = 1/(1 - p * x);
        nd        = (c*Math.exp(-x*x/2)*t*(t*(t*(t*(t*b5+b4)+b3)+b2)+b1));
    }
    return Math.round(nd*100);
}