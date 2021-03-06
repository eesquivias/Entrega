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
   console.log(priceMin)
   var group_price = d3.range(priceMin,priceMax,30)    
   console.log(group_price)

  var color = d3.scaleQuantize()
                .domain([priceMin, priceMax])
                .range(d3.schemeOranges[9])
    createdPath.attr('fill', (d) => color(d.properties.avgprice))
    createdPath.attr('stroke', 'black')
          
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

        
    var svg= d3.select('div')
            .append('div2')
            .style("position", "absolute") 
            .style("pointer-events", "none") 
            .style("visibility", "visible")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", 5);
    
    var svg=d3.select('div2')
        .append ('svg')
        .attr ('width',400)
        .attr ('height',450)

var categories =features[0].properties.avgbedrooms.map(function(d) {return d.bedrooms})
 
    var scaleX= d3.scaleBand()
    .domain(categories)
    .range([50,340])
    .padding(0.1)
console.log(categories)
    var ymin= d3.min(features[0].properties.avgbedrooms,(function(d) {return d.total}))
    var ymax= d3.max(features[0].properties.avgbedrooms,(function(d) {return d.total}))
    console.log(ymax)
    var scaleY= d3.scaleLinear()
    .domain([ymax,0])
    .range([25,350])
    

    var xAxis=  d3.axisBottom(scaleX)
    var yAxis= d3.axisLeft(scaleY).ticks(5)
console.log(features[0])
    svg.append('g')
    .attr('transform','translate(25,350)') 
    .call(xAxis);
    svg.append('g')
    .attr('transform','translate(75,0)')
    .call(yAxis);

//barras para el grafico
    svg.append('g')
    .selectAll('rect')
    .data(features[0].properties.avgbedrooms)
    .enter()
    .append('rect')
    .attr('x',function(d){
        return scaleX(d.bedrooms) +25
    })
    .attr('y',function(d){ 
        return scaleY(d.total)
    })
    .attr('width',scaleX.bandwidth())
    .attr('height',function(d) { return 350 -scaleY(d.total) }  )
    .attr('fill', '#fdb462')
    .attr('stroke', 'black');

//total de propiedades con cada tipo de habitacion
svg.append('g')
   .selectAll('text')
   .data(features[0].properties.avgbedrooms)
   .enter()
   .append('text')
   .attr('x',function (d){return scaleX(d.bedrooms) + 15 + scaleX.bandwidth()/2})
   .attr('y',function (d) {return scaleY(d.total)})
   .text(function (d){ return d.total})
   .attr ('font-weight','bold') 
   .attr("font-size", 14)

// nombre del barrio
  svg.append('text')
    .attr('transform', 'translate(' + 150 +','+ 425+')')   
    .attr("text-anchor", "middle")  
    .style("font-size", "22px") 
    .text('Barrio de Palacio')
    .attr ('font-weight','bold') ;

    //titulo eje X
    svg.append('text')
    .attr('transform', 'translate(' + 160 +','+ 390+')')   
    .attr("text-anchor", "middle")  
    .style("font-size", "14px") 
    .text('Habitaciones')
    .attr ('font-weight','bold')
    .attr ('font-family','calibri') ;

    //titulo eje y
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dx", -75)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .text("Total pisos")
        .attr ('font-weight','bold')
        .attr ('font-family','calibri') 
}