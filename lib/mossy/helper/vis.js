/*
* Author: Jiawei Xu
* File: vis.js
* Date: July 27, 2018
* Liscene: MIT
*
* @param {Object} d3 - a d3 object
* @param {Object} config - Object holding options and data
* @param {Array} data - array of data
* @param {String} parent - string containing parent element's id/class/tag
*
* Working D3 Versions: v3, v4, v5
*
* Options:
*   -> cellSize - size of each cell
*   -> tooltip - to display tooltip or not
*   -> legend - to display legend or not
*   -> fontSize - size of fonts
*   -> fontFamily - font family
*   -> data - data for cells
*/

const Vis = (() => {
  let v_parent = new WeakMap();
  class Vis {
    constructor(parent) {
      v_parent.set(this, parent);
    }
    getLongestStringLength(data) {
      let length = 0;
      for(let i = 0; i < data.length; ++i) {
        if (data[i].length > length) {
          length = data[i].length;
        }
      }
      return length * 7.2 + 10;
    }
    view(d3, config) {
      const parent = v_parent.get(this);
      const chart = document.createElement("div");
      const margin = { top: this.getLongestStringLength(config.cols), right: 10, bottom: 20, left: this.getLongestStringLength(config.rows) };
      const cellSize = config.cellSize;
      const rowNumber = config.rows.length;
      const colNumber = config.cols.length;
      const Width = cellSize * colNumber;
      const Height = cellSize * rowNumber;
      chart.id = "heatmap";
      const svg = d3
        .select(parent)
        .append("svg")
        .attr("width", Width + margin.left + margin.top + 10)
        .attr("height", Height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + margin.left + "," + margin.top + ")"
        );
      if (config.tooltip) {
        const tooltip = d3
          .select(parent)
          .append("div")
          .attr("id", "heattooltip")
          .style("margin", 0)
          .style("font-family", config.fontFamily)
          .style("font-size", config.fontSize)
          .style("padding", "5px 10px")
          .style("background-color", "#FFFFFF")
          .style("position", "absolute")
          .style("box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)")
          .style("display", "none");
        tooltip.append("span")
          .attr("id", "hmrow")
          .style("display", "block");
        tooltip.append("span")
          .attr("id", "hmcol")
          .style("display", "block");
        tooltip.append("span")
          .attr("id", "hmvalue")
          .style("display", "block");
      }
      const rowLabels = svg
        .append("g")
        .attr("class", "rowLabels")
        .selectAll(".rowLabelg")
        .data(config.rows)
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", 0)
        .attr("y", (d, i) => {
          return (i*cellSize+(cellSize/1.6));
        })
        .style("text-anchor", "end")
        .style("transform", "translateX(-5px)")
        .style("font-family", config.fontFamily)
        .style("font-size", config.fontSize)
        .style("fill", "#333")
        .style("user-select", "none")
        .attr("id", (d,i)=>"heatmaprow"+i);
      const colLabels = svg
        .append("g")
        .attr("class", "colLabels")
        .selectAll(".colLabelg")
        .data(config.cols)
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", 0)
        .attr("y", (d, i) => {
          return (i*cellSize + 3);
        })
        .style("text-anchor", "left")
        .attr("transform", "translate(" + cellSize / 2 + ",-6) rotate(-90)")
        .style("font-family", config.fontFamily)
        .style("font-size", config.fontSize)
        .style("fill", "#333")
        .style("user-select", "none")
        .attr("id", (d,i)=>"heatmapcol"+i);
      const heatMap = svg
        .append("g")
        .attr("class", "g3")
        .selectAll(".cellg");
        for(let i = 0; i < config.data.length; ++i) {
          heatMap.data(config.data[i], (d,i) => {return d.X})
          .enter()
          .append("rect")
          .attr("x", (d, di) => di * cellSize)
          .attr("y", (d,di) => i * cellSize)
          .attr(
            "class",
            (d,di) => "cr" + (i) + " cc" + (di)
          )
          .attr("width", cellSize)
          .attr("height", cellSize)
          .style("fill", "#00D8BD")
          .style("fill-opacity", (d)=>d.Xn)
          .style("stroke", "#FF008E")
          .style("stroke-width", 0)
          .on("mouseover", function(d,i) {
              d3.select(this).style("stroke-width", "0.5px");
              const col = d3.select("#heatmapcol"+i).style("fill","#FF008E");
              const row = d3.select("#heatmaprow" + d.Row).style("fill", "#FF008E");
              const tooltip = d3.select("#heattooltip")
                .style("display", "block")
                .style("left", d3.event.offsetX + 5 + "px")
                .style("top", d3.event.offsetY + 5 + "px")
              tooltip.select("#hmvalue")
                .text("Data: " + d.X);
              tooltip.select("#hmrow")
                .text("Row: " + row._groups[0][0].innerHTML);
              tooltip.select("#hmcol")
                .text("Col: " + col._groups[0][0].innerHTML);
          })
          .on("mouseout", function(d,i) {
            d3.select(this).style("stroke-width", 0);
            d3.select("#heatmapcol"+i).style("fill","#333");
            d3.select("#heatmaprow"+d.Row).style("fill","#333");
            d3.select("#heattooltip").style("display", "none");
          });
        }
      if (config.legend) {
        const legend = svg
          .append("g")
          .attr("class", "legend");

        const gradient = legend.append("linearGradient")
          .attr("id", "gradient")
          .attr("gradientUnits","objectBoundingBox")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 2.5)
          .attr("y2", 0);
        gradient.append("stop")
          .attr("offset", 0)
          .attr("style", "stop-color: #FFFFFF");
        gradient.append("stop")
          .attr("offset", 0.5)
          .attr("style", "stop-color: #00D8BD");
          legend.append("rect")
          .attr("x", Width - 100)
          .attr("y", Height)
          .attr("width", 100)
          .attr("height", cellSize)
          .attr("stroke", "#AEFFF5")
          .attr("fill", "url(#gradient)");
        legend.append("text")
          .attr("x", 0)
          .attr("y", Height + cellSize - 3)
          .text("0");
      }
    }
  }
  return Vis;
})();

module.exports = Vis;
