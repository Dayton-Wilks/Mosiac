/********************************************************************
 * Exploding box plot found at https://github.com/mcaule/d3_exploding_boxplot
 * 
 * Modified by: Morgan Loring
 * Email: morganl@flowjo.com
 * Purpose: Generates a box and whisker plot based on the passed in data.
 *      Clicking on a box will make it explode and display the data points.
 *      Double clicking will hide the points and show the box again.
 */
import * as d3 from 'd3';

import './boxAndWhisker.css';

export default function makeBoxPlots(data, aes) {
    data.forEach(function (x, index) {
        aes.index = index;
        let chart = exploding_boxplot(x, aes);
        chart('#boxAndWhiskerDiv');
    });
    d3.select('#boxAndWhiskerDiv')
        .append('div')
        .attr('class', 'd3-exploding-boxplot tip')
        .style('top', -50 + 'px')
        .style('left', -50 + 'px')
        .selectAll('p')
        .data([0, 1, 2])
        .enter()
        .append('p')
        .style('padding', '0px')
        .text('test');

}

//these are the default colors from the box and whisker plot implementation
//var default_colors = ["#a6cee3", "#ff7f00", "#b2df8a", "#1f78b4", "#fdbf6f", "#33a02c", "#cab2d6", "#6a3d9a", "#fb9a99", "#e31a1c", "#ffff99", "#b15928"];

//Theses came from the /visuals/ChordDiagramLake.js file. Not sure I like the colors
//but they will work for now. Should we make a visuals resource file with colors and 
//other relavent info in it? Rather than duplicate code, we could just import that file
var default_colors = [
    '#9e0142',
    '#d53e4f',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#ffffbf',
    '#e6f598',
    '#abdda4',
    '#66c2a5',
    '#3288bd',
    '#5e4fa2',
];

var compute_boxplot = function (data, iqr_k, value) {
    iqr_k = iqr_k || 1.5
    value = value || Number

    var seriev = data.map(functorkey(value)).sort(d3.ascending)

    var quartiles = [
        d3.quantile(seriev, 0.25),
        d3.quantile(seriev, 0.5),
        d3.quantile(seriev, 0.75)
    ]

    var iqr = (quartiles[2] - quartiles[0]) * iqr_k;

    //group by outlier or not
    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;
    var box_data = d3.nest()
        .key(function (d) {
            d = functorkey(value)(d)
            var type = (d < quartiles[0] - iqr || d > quartiles[2] + iqr) ? 'outlier' : 'normal';
            if (type == 'normal' && (d < min || d > max)) {
                max = Math.max(max, d)
                min = Math.min(min, d)
            }
            return type
        })
        .map(data)

    if (!box_data.outlier)
        box_data.outlier = []
    box_data.quartiles = quartiles
    box_data.iqr = iqr
    box_data.max = max
    box_data.min = min


    return box_data
}

//big function containing all the pieces to make a box and whisker plot
function exploding_boxplot(data, aes) {
    //defaults
    var iqr = 1.5
    var height = 480
    var width = 200
    var boxpadding = 0.2
    var margin = { top: 10, bottom: 30, left: 40, right: 10 }
    var rotateXLabels = false;

    aes.radius = aes.radius || constant(3)
    aes.label = aes.label || constant('aes.label undefined')

    var ylab = typeof aes.y === "string" ? aes.y : ""
    var xlab = typeof aes.group === "string" ? aes.group : ""

    var yscale = d3.scaleLinear()
        .domain(d3.extent(data.map(functorkey(aes.y))))
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

    var colorIndex = aes.index % 11;
    var plotIndex = aes.index;

    var groups
    if (aes.group) {
        groups = d3.nest()
            .key(functorkey(aes.group))
            .entries(data)
    } else {
        groups = [{ key: '', values: data }]
    }

    var xscale = d3.scaleBand()
        .domain(groups.map(function (d) { return d.key }))
        .rangeRound([0, width - margin.left - margin.right]).padding(boxpadding)

    //create boxplot data
    groups = groups.map(function (g) {
        var o = compute_boxplot(g.values, iqr, aes.y)
        o['group'] = g.key
        return o
    })

    var tickFormat = function (n) { return n.toLocaleString() }

    var svg, container;
    var chart = function (elem) {
        svg = d3.select(elem).append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'explodingBoxPlot')

        svg.append('g').append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('color', default_colors[colorIndex])
            .style('opacity', 0)
            .on('dblclick', implode_boxplot)


        container = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


        var xAxis = d3.axisBottom().scale(xscale)
        var yAxis = d3.axisLeft().scale(yscale).tickFormat(tickFormat)



        var xaxisG = container.append('g')
            .attr('class', 'd3-exploding-boxplot x axis')
            .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
            .call(xAxis);

        if (rotateXLabels) {
            xaxisG.selectAll('text')
                .attr("transform", "rotate(90)")
                .attr("dy", ".35em")
                .attr("x", "9").attr("y", "0")
                .style("text-anchor", "start");
        }

        //adds the bottom axis label.
        //might be useful if we ever want to add more than one box to the same axis
        // xaxisG.append("text")
        //     .attr("x", (width - margin.left - margin.right) / 2)
        //     .attr("dy", ".71em")
        //     .attr('y', margin.bottom - 14)
        //     .style("text-anchor", "middle")
        //     .text(xlab);

        container.append('g')
            .attr('class', 'd3-exploding-boxplot y axis')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -margin.top - d3.mean(yscale.range()))
            .attr("dy", ".71em")
            .attr('y', -margin.left + 5)
            .style("text-anchor", "middle")
            .text(ylab);

        container = container.insert('g', '.axis')

        draw()
    };
    var create_jitter = function (g, i) {
        if (g.$outlier) {
            d3.select(this).append('g')
            .attr('class', 'd3-exploding-boxplot outliers-points')
            .selectAll('.point')
            .data(g.$outlier)
            .enter()
            .append('circle')
            .call(init_jitter)
            .call(draw_jitter)
        }
        d3.select(this).append('g')
            .attr('class', 'd3-exploding-boxplot normal-points')
    };

    var init_jitter = function (s) {
        s.attr('class', 'd3-exploding-boxplot point')
            .attr('r', functorkey(aes.radius))
            .attr('style', 'fill: ' + default_colors[colorIndex])

            .on('mousemove', tipFunction)//newtip
            .on('mouseout', mouseOut)
    }
    var draw_jitter = function (s) {
        s.attr('cx', function (d) {
            var w = xscale.bandwidth()
            return Math.floor(Math.random() * w)
        })
            .attr('cy', function (d) {
                return yscale((functorkey(aes.y))(d))
            })
    }

    //adds all of the box elements to the g element
    var create_boxplot = function (g, i) {
        var s = d3.select(this).append('g')
            .attr('class', 'd3-exploding-boxplot box')
            .on('click', function (d) {
                explode_boxplot(this.parentNode, g)
            })
            .selectAll('.box')
            .data([g])
            .enter()
        //box
        s.append('rect')
            .attr('style', 'fill: ' + default_colors[colorIndex])
            .attr('class', 'd3-exploding-boxplot box')
            .on('mousemove', tipFunction)
            .on('mouseout', mouseOut)
        //median line
        s.append('line').attr('class', 'd3-exploding-boxplot median line')
            .on('mousemove', tipFunction)
            .on('mouseout', mouseOut)
        //min line
        s.append('line').attr('class', 'd3-exploding-boxplot min line hline')
            .on('mousemove', tipFunction)
            .on('mouseout', mouseOut)
        //min vline
        s.append('line').attr('class', 'd3-exploding-boxplot line min vline')
        //max line
        s.append('line').attr('class', 'd3-exploding-boxplot max line hline')
            .on('mousemove', tipFunction)
            .on('mouseout', mouseOut)
        //max vline
        s.append('line').attr('class', 'd3-exploding-boxplot line max vline')
    };

    //sets the box plot to it's default state
    var draw_boxplot = function (s) {
        //box
        s.select('rect.box')
            .attr('x', 0)
            .attr('width', xscale.bandwidth())
            .attr('y', function (d) { return yscale(d.quartiles[2]) })
            .attr('height', function (d) {
                return yscale(d.quartiles[0]) - yscale(d.quartiles[2])
            })
        //median line
        s.select('line.median')
            .attr('x1', 0).attr('x2', xscale.bandwidth())
            .attr('y1', function (d) { return yscale(d.quartiles[1]) })
            .attr('y2', function (d) { return yscale(d.quartiles[1]) })
        //min line
        s.select('line.min.hline')
            .attr('x1', xscale.bandwidth() * 0.25)
            .attr('x2', xscale.bandwidth() * 0.75)
            .attr('y1', function (d) { return yscale(Math.min(d.min, d.quartiles[0])) })
            .attr('y2', function (d) { return yscale(Math.min(d.min, d.quartiles[0])) })
        //min vline
        s.select('line.min.vline')
            .attr('x1', xscale.bandwidth() * 0.5)
            .attr('x2', xscale.bandwidth() * 0.5)
            .attr('y1', function (d) { return yscale(Math.min(d.min, d.quartiles[0])) })
            .attr('y2', function (d) { return yscale(d.quartiles[0]) })
        //max line
        s.select('line.max.hline')
            .attr('x1', xscale.bandwidth() * 0.25)
            .attr('x2', xscale.bandwidth() * 0.75)
            .attr('y1', function (d) { return yscale(Math.max(d.max, d.quartiles[2])) })
            .attr('y2', function (d) { return yscale(Math.max(d.max, d.quartiles[2])) })
        //max vline
        s.select('line.max.vline')
            .attr('x1', xscale.bandwidth() * 0.5)
            .attr('x2', xscale.bandwidth() * 0.5)
            .attr('y1', function (d) { return yscale(d.quartiles[2]) })
            .attr('y2', function (d) { return yscale(Math.max(d.max, d.quartiles[2])) })
    };

    //hides the box. used in the explode_boxplot function
    var hide_boxplot = function (g, i) {
        var s = d3.select(g._groups[0][0])
        s.select('rect.box').transition()
            .ease(d3.easeBackIn)
            .duration(300)
            .attr('x', xscale.bandwidth() * 0.5)
            .attr('width', 0)
            .attr('y', function (d) { return yscale(d.quartiles[1]) })
            .attr('height', 0)
        //median line
        s.selectAll('line')
            .attr('x1', xscale.bandwidth() * 0.5)
            .attr('x2', xscale.bandwidth() * 0.5)
            .attr('y1', function (d) { return yscale(d.quartiles[1]) })
            .attr('y2', function (d) { return yscale(d.quartiles[1]) })
    };

    //explodes the box. Hides the box and displays the data points instead
    var explode_boxplot = function (elem, g) {
        d3.select(elem).select('g.box')
            .call(hide_boxplot)
        d3.select(elem).selectAll('.normal-points')
            .selectAll('.point')
            .data(g.$normal)
            .enter()
            .append('circle')
            .attr('cx', xscale.bandwidth() * 0.5)
            .attr('cy', yscale(g.quartiles[1]))
            .call(init_jitter)
            .transition()
            .ease(d3.easeBackOut)
            .delay(function () {
                return 300 + 100 * Math.random()
            })
            .duration(function () {
                return 300 + 300 * Math.random()
            })
            .call(draw_jitter)
    };

    //sets plot to the default state. Undos the explosion
    var implode_boxplot = function (elem, g) {
        container.selectAll('.normal-points')
            .each(function (g) {
                d3.select(this)
                    .selectAll('circle')
                    .transition()
                    .ease(d3.easeBackOut)
                    .duration(function () {
                        return 300 + 300 * Math.random()
                    })
                    .attr('cx', xscale.bandwidth() * 0.5)
                    .attr('cy', yscale(g.quartiles[1]))
                    .remove()
            })


        container.selectAll('.boxcontent')
            .transition()
            .ease(d3.easeBackOut)
            .duration(300)
            .delay(200)
            .call(draw_boxplot)
    }

    //after the elements are created, this is called to make sure 
    //they are in the correct place. 
    function draw() {
        var boxContent = container.selectAll('.boxcontent')
            .data(groups)
            .enter().append('g')
            .attr('class', 'd3-exploding-boxplot boxcontent')
            .attr('transform', function (d) {
                return 'translate(' + xscale(d.group) + ',0)'
            })
            .each(create_jitter)
            .each(create_boxplot)
            .call(draw_boxplot);

    };

    //getter/setters for the visual
    chart.iqr = function (_) {
        if (!arguments.length) return iqr;
        iqr = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        xscale.rangeRoundBands([0, width - margin.left - margin.right], boxpadding)
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        yscale.range([height - margin.top - margin.bottom, 0])
        return chart;
    };

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        //update scales
        xscale.rangeRoundBands([0, width - margin.left - margin.right], boxpadding)
        yscale.range([height - margin.top - margin.bottom, 0])
        return chart;
    };

    chart.xlab = function (_) {
        if (!arguments.length) return xlab;
        xlab = _;
        return chart;
    };
    chart.ylab = function (_) {
        if (!arguments.length) return ylab;
        ylab = _;
        return chart;
    };
    chart.ylimit = function (_) {
        if (!arguments.length) return yscale.domain();
        yscale.domain(_.sort(d3.ascending))
        return chart
    };
    chart.yscale = function (_) {
        if (!arguments.length) return yscale;
        yscale = _
        return chart
    };
    chart.xscale = function (_) {
        if (!arguments.length) return xscale;
        xscale = _
        return chart
    };
    chart.tickFormat = function (_) {
        if (!arguments.length) return tickFormat;
        tickFormat = _
        return chart
    };

    chart.rotateXLabels = function (_) {
        if (!arguments.length) return rotateXLabels;
        rotateXLabels = _
        return chart;
    }

    return chart;
}

function functorkey(v) {
    return typeof v === "function" ? v : function (d) { return d[v]; };
}

function constant(x) {
    if (typeof x === "function") return x;
    return function () {
        return x;
    }
}

//tooltip function. Based on what is being hovered over, the proper 
//information is returned
var tipFunction = function (d) {
    var hovered = d3.select(this),
        tip = d3.select('#boxAndWhiskerDiv')
            .select('.tip'),
        p = tip.select('p');

    tip.selectAll('p').text('');


    if (hovered.classed('d3-exploding-boxplot median line')) {
        p.text('Median: ' + d.quartiles[1].toFixed(3));
    }
    else if (hovered.classed('d3-exploding-boxplot min line hline')) {
        p.text('Minimum: ' + d.min.toFixed(3));
    }
    else if (hovered.classed('d3-exploding-boxplot max line hline')) {
        p.text('Maximum: ' + d.max.toFixed(3));
    }
    else if (hovered.classed('d3-exploding-boxplot box')) {
        let ps = tip.selectAll('p');
        d3.select(ps._groups[0][0]).text('Upper: ' + d.quartiles[2].toFixed(3));
        d3.select(ps._groups[0][1]).text('Median : ' + d.quartiles[1].toFixed(3));
        d3.select(ps._groups[0][2]).text('Lower: ' + d.quartiles[0].toFixed(3));
    }
    else {
        p.text(d.Value.toFixed(3));
    }

    tip.style('display', 'block')
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY) + 'px');
}

function mouseOut(d) {
    d3.select('#boxAndWhiskerDiv')
        .select('.tip')
        .style('display', 'none')
        .style('left', -50)
        .style('top', -50);
}