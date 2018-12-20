/*********************************************************************
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 * File Name: MSTHelper.js
 * Purpose: Functions to create the different data objects for the MST
*********************************************************************/

import prims from 'prim-mst';

/*********************************************************************
 * makeGraph
 * 
 * purpose: makes a complete graph based on the table data and the
 *      selected columns. That graph is passed into the Prim's package
 *      to calculate the MST of the graph
 * 
 * Parameters: props: an object containing a 2d data array and an 
 *      array of selected columns
*********************************************************************/
export function makeGraph(props) {
    var verticies = [];
    for (let ii = 1; ii < props.data.length; ii++) {
        for (let jj = 1; jj < props.data.length; jj++) {
            if (ii != jj) {
                let weight = 0;
                props.selectedTags.forEach((col) => {
                    weight += Math.pow(props.data[ii][col + 1] - props.data[jj][col + 1], 2)
                });
                verticies.push(
                    [ii - 1, jj - 1,
                    Math.sqrt(weight)]
                )
            }
        }
    }

    return prims(verticies);
}

/*********************************************************************
 * makeMSTNodes
 * 
 * purpose: Makes an array of objects representing each node (circle) in
 *      the visualization. Each object contains the circles starting x and y
 *      position as well as a name and an ID.
 * 
 * Parameters: data: 2d array containing the table data. Used only for the 
 *      row headers in column 0 
*********************************************************************/
export function makeMSTNodes(data) {
    var d3MSTNodes = [],
        radius = 200,
        width,
        height,
        mstDiv = document.getElementById('MST');

    if (mstDiv !== null) {
        width = mstDiv.clientWidth / 2;
        height = mstDiv.clientHeight / 2;
    }
    else {
        width = 300;
        height = 300;
    }

    for (let ii = 0; ii < data.length - 1; ii++) {
        let angle = (ii / ((data.length - 1) / 2)) * Math.PI;
        d3MSTNodes.push({
            name: data[ii + 1][0],
            id: ii.toString(),
            x: (radius * Math.cos(angle)) + width,
            y: (radius * Math.sin(angle)) + height
        });
    }

    return d3MSTNodes;
}

/*********************************************************************
 * normalizeData
 * 
 * purpose: formats the edge weights to be between 0 and 1. This new value is 
 *      used to compute the length of each edge in the visualization
 * 
 * Parameters: primsMST: MST representated by a 2d array - output from 
 *      the Prim's calculation
*********************************************************************/
export function normalizeData(primsMST) {
    var largestWeight = -Infinity,
        smallestWeight = Infinity,
        d3MSTEdges = [];

    for (let jj = 0; jj < primsMST.length; jj++) {
        let row = primsMST[jj];
        d3MSTEdges.push({ source: row[0], target: row[1], value: row[2] })
        if (row[2] > largestWeight) largestWeight = row[2];
        if (row[2] < smallestWeight) smallestWeight = row[2];
    }

    for (let ii = 0; ii < d3MSTEdges.length; ii++) {
        let normalized = (d3MSTEdges[ii].value - smallestWeight) / (largestWeight - smallestWeight);
        d3MSTEdges[ii].normalized = normalized;
    }

    return d3MSTEdges;
}