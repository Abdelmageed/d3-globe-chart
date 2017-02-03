import * as d3 from 'd3'
import tip from 'd3-tip'
import custom from './custom.geo.json'
import metorites from './metorites.geo.json'

const chart = () => {
    var width = 960,
        height = 600
    var margin = {
        top: 0, right: 100, bottom: 0, left: 0
    }
    
    
    
    var svg = d3.select('body').append('svg')
        .attr('class', 'container')
        .attr('width', width)
        .attr('height', height)
        //appending a group doesn't seem to fix centering on zooming
//        .append('g')

    
    var chartHeight = height - margin.top - margin.bottom,
        chartWidth = width - margin.left - margin.right
    
    var zoom = d3.zoom()
//        .extent([chartWidth / 2, chartHeight / 2])
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", zoomed)
    
    svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
    
    var chart = svg.append('g')
        .attr('class', 'chart')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('width', chartWidth)
        .attr('height', chartHeight)
    
    svg
        .call(zoom)
//        .append('g')
        
    //tooltip
    var tooltip = tip().html(d=>`
    <strong>Name: </strong><span>${d.properties.name}</span>
    <br>
    <strong>Year: </strong><span>${parseInt(d.properties.year)}</span>
    <br>
    <strong>Mass: </strong><span>${+d.properties.mass}</span>
    <br>
    <strong>Recclass: </strong><span>${d.properties.recclass}</span>
`)
    .attr('class', 'tooltip')
    chart.call(tooltip)
    
     
     
    var projection = d3.geoEquirectangular()
        .translate([chartWidth / 2, height / 2])
        
   function zoomed() {
        let scale = d3.event.transform.k
        chart.attr('transform', `scale(${scale},${scale}) translate(${d3.event.transform.x.toFixed(4)}${d3.event.transform.y.toFixed(4)})`)
        }

    var path = d3.geoPath(projection)
    

        chart.append('path')
            .datum(custom)
            .attr('d', path)

            var size = d3.scaleThreshold()
                .range([0, 1.5, 4, 6, 12])
                .domain([0, 50000,  500000, 1000000])
            
            let extent = d3.extent(metorites.features, d=>parseInt(d.properties.year)) 
            var color = d3.scaleThreshold()
                .range(d3.schemeCategory20.slice(0, 12).slice(1).reverse())
                .domain(d3.range(1600, 2000, 40))
            
            
            //legend
            let legendContainer = d3.select('body').append('svg')
                .attr('class', 'legend-container')
                .attr('width', 60)
                .attr('height', 200)
            
            legendContainer
                .append('text')
                .attr('transform', 'translate(10,20)')
                .text('Year')
            
            let legend = legendContainer
                .append('g')
                .selectAll('.legend')
                .data(color.domain().slice(1).reverse()).enter()
                .append('g')
                .attr("class", "legend")
                .attr("transform", (d,i)=>`translate(0,${i*20 + 25})`)

            legend.append('rect')
                .attr('width', 10)
                .attr('height', 20)
                .style('fill', color)

            legend.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .attr('dy', 5)
                .text(String)
            
            let arr = metorites.features.map(d=>parseInt(d.properties.year))
            arr.sort(compareNumbers)
            chart.selectAll('.point')
                .data(metorites.features).enter()
                .append('path')
                .attr('class', 'point')
                .attr('d', path.pointRadius(d=>{
                    let mass = d.properties.mass
                    mass = (mass == 0 || mass === null)?0.01:+d.properties.mass
                    return size(mass)}))
                .attr('fill', d=>{
                return color(parseInt(d.properties.year))})
                .on('mouseover', (d, i)=>{
                let target = d3.select(d3.event.target)
                target.classed('point-hovered', true)
                tooltip.show(d, i)
            })
                .on('mouseout', d=>{
                let target = d3.select(d3.event.target)
                target.classed('point-hovered', false)
                tooltip.hide()
            })

}

function compareNumbers (a, b){
    return a - b;
}
export default chart