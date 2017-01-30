import * as d3 from 'd3'

const chart = () => {
    var width = 960,
        height = 600
    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)

    var projection = d3.geoEquirectangular()
        .translate([width / 2, height / 2])
        //    .scale([1000])

    var path = d3.geoPath(projection)

    
    d3.json('app/custom.geo.json', json => {

        svg.append('path')
            .datum(json)
            .attr('d', path)

        //draw metorited landings on top of globe features
        d3.json('app/metorites.geo.json', json => {
            
            var size = d3.scaleLog()
                .range([1, 15])
                .domain([2, Math.pow(2, 32)])
            .base(2)
            
            console.log(size(20))
            svg.selectAll('path')
                .data(json.features).enter()
                .append('path')
                .attr('d', path.pointRadius(d=>{
                    let mass = d.properties.mass
                    mass = (mass == 0 || mass === null)?0.01:+d.properties.mass
                    console.log(size(mass))
                    return size(mass)}))
                .attr('fill', 'white')
        })
    })

}

function min(arr){
    let min = Number.POSITIVE_INFINITY,
        max = 0
    for(let i = 1; i < arr.length; i++){
        if (arr[i]){
            if (min > arr[i]) min = arr[i]
            if (max < arr[i]) max = arr[i]
        }
    }
    return [min, max]
}
export default chart