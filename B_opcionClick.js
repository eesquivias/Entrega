d3.json('practica_airbnb_eva.json')
    .then((featureCollection) => {
        drawMap(featureCollection);
    });

function drawMap(featureCollection) {

    var width = 800;
    var height = 800;

    var svg = d3.select('div')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');
    

    var center = d3.geoCentroid(featureCollection); 
    var projection = d3.geoMercator()
        .fitSize([width, height-50], featureCollection) 
        
    var pathProjection = d3.geoPath().projection(projection);
    var features = featureCollection.features;
   console.log(features)
    var createdPath = svg.selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', (d) => pathProjection(d))
        .attr("opacity", function(d, i) {
            d.opacity = 1
            return d.opacity
        });

        
    var priceMin=d3.min(features,(d)=>d.properties.avgprice)
    var priceMax=d3.max(features,(d)=>d.properties.avgprice)
   
   var group_price = d3.range(priceMin,priceMax,30)    
   

  var color = d3.scaleQuantize()
                   .domain([priceMin, priceMax])
                   .range(d3.schemeOranges[9])
    createdPath.attr('fill', (d) => color(d.properties.avgprice))
    createdPath.attr("stroke-width", function(d, i) {
        d.strokeWidth = 1
        return d.strokeWidth
    })
    createdPath.attr('stroke', 'black')
    createdPath.on('click', handleClick)
    
    var nblegend = 10;
    var widthRect = (width / nblegend) - 2;
    var heightRect = 10;

    var legend = svg.append("g")
        .selectAll("rect")
        .data(d3.schemeOranges[9])
        .enter()
        .append("rect")
        .attr("width", widthRect)
        .attr("height", heightRect)
        .attr("x", (d, i) => (i * (widthRect + 2)))
        .attr('y',height -40)
        .attr("fill", (d) => d);
        

    var text_legend = svg.append("g")
        .selectAll("text")
        .data(group_price)
        .enter()
        .append("text")
        .attr("x", (d, i) => (i * (widthRect + 2)))
        .attr("y", height-15)
        .text((d) => 'Desde ' + d +  ' Eur')
        .attr("font-size", 12)

        
    var tooltip= d3.select('div')
            .append('div2')
            .attr('class','tooltip')
            .style("position", "absolute") 
            .style("pointer-events", "none") 
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", 5);
    
    features.forEach((d, i) => {
                d.idx = i 
            })

        function handleClick(event,d){
        d.strokeWidth = d.strokeWidth ? 4 : 1;
        var svgTip=d3.select('div2')
        .append ('svg')
        .attr ('width',300)
        .attr ('height',300)
        
        d3.select(this)
        .attr('stroke-width', d.strokeWidth);
        tooltip.transition()
            .duration(100)
            .style('visibility','visible')
            .style("left", (width-50) + "px")
            .style("top", (event.pageY -250) + "px")
     
    
var categories =features[d.idx].properties.avgbedrooms.map(function(d) {return d.bedrooms})
 
var scaleX= d3.scaleBand()
    .domain(categories)
    .range([25,225])
    .padding(0.1)
console.log(categories)
var ymin= d3.min(features[d.idx].properties.avgbedrooms,(function(d) {return d.total}))
var ymax= d3.max(features[d.idx].properties.avgbedrooms,(function(d) {return d.total}))
console.log(ymax)
  
var scaleY= d3.scaleLinear()
        .domain([ymax,0])
        .range([20,200])
    

var xAxis=  d3.axisBottom(scaleX)
var yAxis= d3.axisLeft(scaleY).ticks(5)

svgTip.append('g')
    .attr('transform','translate(25,200)') 
    .call(xAxis);
svgTip.append('g')
    .attr('transform','translate(50,0)')
    .call(yAxis);

//barras para el gráfico
svgTip.append('g')
    .selectAll('rect')
    .data(features[d.idx].properties.avgbedrooms)
    .enter()
    .append('rect')
    .attr('x',function(d){
        return scaleX(d.bedrooms) +25
    })
    .attr('y',function(d){ 
        return scaleY(d.total)
    })
    .attr('width',scaleX.bandwidth())
    .attr('height',function(d) { return 200 -scaleY(d.total) }  )
    .attr('fill', '#fdb462');

//total de propiedades con cada tipo de habitación
svgTip.append('g')
   .selectAll('text')
   .data(features[d.idx].properties.avgbedrooms)
   .enter()
   .append('text')
   .attr('x',function (d){return scaleX(d.bedrooms) + 15 + scaleX.bandwidth()/2})
   .attr('y',function (d) {return scaleY(d.total)})
   .text(function (d){ return d.total}) 
   .attr("font-size", 13)

// nombre del barrio
svgTip.append('text')
    .attr('transform', 'translate(' + 125 +','+ 290+')')   
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .text(d.properties.name);

    //título eje X
    svgTip.append('text')
    .attr('transform', 'translate(' + 125 +','+ 230+')')   
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .text('Habitaciones');

    //título eje y
    svgTip.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dx", -75)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px") 
        .text("Total pisos");

}   

}
