/*********************************************************************
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 * File Name: MinimumSpanningTree.js
 * Purpose: Creates a MST in d3 based on the passed in data
*********************************************************************/

import * as d3 from 'd3';
import './MST.css';

export default function (nodes, edges) {

    var width = document.getElementById('MST').offsetWidth,
        height = document.getElementById('MST').offsetHeight,
        radius = 10,
        //append an svg element to the parent div and set it's class, width and height
        svg = d3.select('#MST')
            .append('svg')
            .attr('class', 'MST')
            .attr('width', '100%')
            .attr('height', '100%');

    //init. a force simulation with the passed in nodes
    var simulation = d3.forceSimulation(nodes);

    //sets up the strength of the line forces
    //also sets the length of the line
    var link_force = d3.forceLink(edges)
        .id(function (d) { return d.id; })
        .strength(2)
        .distance(function (d) {
            let length = d.normalized * 300
            return length > 40 ? length : 40;
        });

    //forceX and forceY act as weak centering forces. i.e. they 
    //slowly pull the nodes to the center of the svg
    var forceX = d3.forceX(width / 2).strength(.02);
    var forceY = d3.forceY(height / 2).strength(.02);

    //adds the forces to the simulation
    simulation
        .force("charge", d3.forceManyBody().strength(-50))
        .force('x', forceX)
        .force('y', forceY)
        .force("links", link_force);

    d3.select(window).on('resize', function () {
        let mstDiv = document.getElementById('MST');
        width = mstDiv.clientWidth;
        height = mstDiv.clientHeight;
        forceX.x(width / 2);
        forceY.y(height / 2);
    });

    //sets the tickfunction
    simulation.on('tick', tickFunction);

    //appends a div to be used as a tool tip
    var tip = d3.select('#MST').append('div')
        .attr('class', 'MST tip');

    //adds a span inside the tool tip div
    tip.append('span')
        .attr('class', 'MST tipSpan');

    //appends a line based on the data passed into the function
    var lines = svg.append('g')
        .attr('class', 'MST line')
        .selectAll('line')
        .data(edges)
        .enter().append("line");

    //appends a group for each circle-label pair
    var nodes = svg
        .append('g')
        .attr('class', 'MST nodes')
        .selectAll('.MST.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'MST node')

    //appends a circle for each node passed in
    nodes.append('circle')
        .attr('class', 'MST circle')
        .attr('r', radius)
        .on('mousemove', circleMouseIn)
        .on('mouseout', circleMouseOut)
        .on('contextmenu', function () {
            let clickedNode = d3.select(this);
            if (clickedNode.classed('fixed')) {
                clickedNode.classed('fixed', false);
            }
            d3.select(clickedNode.node().parentNode)._groups[0][0].__data__.fx = null;
            d3.select(clickedNode.node().parentNode)._groups[0][0].__data__.fy = null;
        });

    //sets the text of each label
    nodes.append('text')
        .attr('class', 'MST label')
        .text(function (d) { return d.name; });


    //add tool tip events to the lines
    lines.call(function (s) {
    })
        .on('mousemove', function (d) {
            tip.style('display', 'block')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px')

            tip.select('.tipSpan')
                .text('Weight: ' + d.value.toFixed(3));
        })
        .on('mouseout', function (d) {
            tip.style('display', 'none')
                .style('left', -50)
                .style('top', -50);
        });


    var dragHandler = d3.drag()
        .on('start', dragStart)
        .on('drag', drag)
        .on('end', dragEnd);

    dragHandler(nodes);

    //**********************************************************************************************************************/
    //these three functions are the drag event for the nodes. Updates they're position based on where they are dragged.
    function dragStart(d) {
        let draggedNode = d3.select(this).select('circle');
        if (!draggedNode.classed('fixed')) {
            draggedNode.classed('fixed', true);
        }

        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnd(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        if (!d3.event.active) simulation.alphaTarget(0).restart();
    }
    //**********************************************************************************************************************/


    /*********************************************************************
         * tickFunction
         * 
         * purpose: Called by d3 on every tick. Tick = some fraction of a second.
         *      Updates the positions of the elements based on the forces in
         *      the simulation
         * 
         * Parameters: N/A
        *********************************************************************/

    function tickFunction() {
        d3.selectAll('.MST.circle')
            .attr('cx', function (d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr('cy', function (d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        d3.selectAll('.MST.label')
            .attr('x', function (d) {
                let bbox = d3.select(this).node().getBBox();
                return Math.max(0, Math.min(width - bbox.width - 10, d.x)) + 10;
            })
            .attr('y', function (d) {
                let bbox = d3.select(this).node().getBBox();
                return Math.max(0, Math.min(height - bbox.height - 15, d.y)) + 15;
            })

        lines
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
    }


    /*********************************************************************
     * d3.selection.prototype.moveToFront
     * 
     * purpose: used to move a circle and it's label to the front when they are
     *      hovered over. 
     * 
     * Parameters: N/A
    *********************************************************************/
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    /*********************************************************************
     * d3.selection.prototype.moveToBack
     * 
     * purpose: used to move a circle and it's label to the back when they are
     *      no longer hovered over. 
     * 
     * Parameters: N/A
    *********************************************************************/
    d3.selection.prototype.moveToBack = function () {
        return this.each(function () {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };


    /*********************************************************************
     * circleMouseIn
     * 
     * purpose: mouse event to make the label text get bigger when the circle
     *      is hovered over
     * 
     * Parameters: N/A
    *********************************************************************/
    function circleMouseIn() {
        var text = d3.select(this.parentNode).moveToFront().select('.MST.label')
            .transition()
            .duration(250)
            .style('font-size', '18px')
    }

    /*********************************************************************
     * circleMouseOut
     * 
     * purpose: mouse event to make the label text go back to normal when 
     *      the mouse leaves a circle
     * 
     * Parameters: N/A
    *********************************************************************/
    function circleMouseOut() {
        var text = d3.select(this.parentNode).moveToBack().select('.MST.label')
            .transition()
            .duration(250)
            .style('font-size', '10px')
    }
}