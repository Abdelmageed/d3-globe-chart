import * as d3 from 'd3'
import tip from 'd3-tip'

const chart = () => {
    var width = 960,
        height = 600
    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)
    
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
    svg.call(tooltip)
    
    var projection = d3.geoEquirectangular()
        .translate([width / 2, height / 2])

    var path = d3.geoPath(projection)
    
    d3.json('app/custom.geo.json', json => {

        svg.append('path')
            .datum(json)
            .attr('d', path)

        //draw meteorite landings on top of globe features
        d3.json('app/metorites.geo.json', json => {
            
            var size = d3.scaleThreshold()
                .range([0, 1.5, 4, 6, 12])
                .domain([0, 50000,  500000, 1000000])
            
            let extent = d3.extent(json.features, d=>parseInt(d.properties.year)) 
            var color = d3.scaleThreshold()
                .range(d3.schemeCategory20)
                .domain(d3.range(1600, 2000, 20))
            
            
            let arr = json.features.map(d=>parseInt(d.properties.year))
            arr.sort(compareNumbers)
            svg.selectAll('.point')
                .data(json.features).enter()
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
        })
    })

}

function compareNumbers (a, b){
    return a - b;
}
export default chart