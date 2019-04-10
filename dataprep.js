function genType(d) {
  d.TIMESTAMP  = parseDate(d.TIMESTAMP);
  d.LOW        = +d.LOW;
  d.HIGH       = +d.HIGH; 
  d.OPEN       = +d.OPEN;
  d.CLOSE      = +d.CLOSE;
  d.TOPIC1   = +d.TOPIC1;
  d.VOLATILITY = +d.TOPIC2;
  d.TOPIC3   = +d.TOPIC3;
  d.TOPIC4 = +d.TOPIC4;
  d.TOPIC5   = +d.TOPIC5;
  return d;
}


function timeCompare(date, interval) {
  if (interval == "week")       { var durfn = d3.time.monday(date); }
  else if (interval == "month") { var durfn = d3.time.month(date); }
  else { var durfn = d3.time.day(date); } 
  return durfn;
}

function dataCompress(data, interval) {
  var compressedData  = d3.nest()
                 .key(function(d) { return timeCompare(d.TIMESTAMP, interval); })
                 .rollup(function(v) { return {
                         TIMESTAMP:   timeCompare(d3.values(v).pop().TIMESTAMP, interval),
                         OPEN:        d3.values(v).shift().OPEN,
                         LOW:         d3.min(v, function(d) { return d.LOW;  }),
                         HIGH:        d3.max(v, function(d) { return d.HIGH; }),
                         CLOSE:       d3.values(v).pop().CLOSE,
                         EMEAN:       d3.mean(v, function(d) { return (interval=="week")?d.EMEANW:(interval=="month")?d.EMEANM:d.EMEAND; }),
                         TOPIC1:    d3.mean(v, function(d) { return d.TOPIC1; }),
                         VOLATILITY:  d3.mean(v, function(d) { return d.VOLATILITY; }),
                         TOPIC3:    d3.mean(v, function(d) { return d.TOPIC3; }),
                         TOPIC4:    d3.mean(v, function(d) { return d.TOPIC4; }),
                         TOPIC5:    d3.mean(v, function(d) { return d.TOPIC5; })
                        }; })
                 .entries(data).map(function(d) { return d.values; });

  return compressedData;
}