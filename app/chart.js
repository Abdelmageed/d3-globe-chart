import * as d3 from 'd3'

const chart = ()=>{
    var width = 960,
    height = 600
var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)

var projection = d3.geoEquirectangular()
    .translate([width/2, height/2])
//    .scale([1000])

var path = d3.geoPath(projection)

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', json=>{
    svg.append('path')
    .datum(json)
    .attr('d', path)
}
)
}
export default chart