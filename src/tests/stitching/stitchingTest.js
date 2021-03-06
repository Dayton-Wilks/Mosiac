/*
* Author: Jiawei Xu
* File: stitchingTest.js
* Description:
* -> Unit testing for Stitcher library.
* -> tests
*   > Combine two files
*   > Configurations
*   > Filtering
*/

const { expect } = require("chai");
const Stitcher = require("../../../lib/stitching");

describe("Stitcher", () => {
  const testData = [["Source", "Data", "CD7", "CCR7", "CD8", "CD11a", "CD27", "CD28", "CD29", "CD43", "CD45RA", "CD45RO", "CD49d", "CD57", "CD62L", "CD69", "CD107a", "GMCSF", "GzmB", "HLA-DR", "IFN-g", "IL-2", "KLRG1", "MIP1a", "MIP1b", "Perforin", "ButtHead"],
["demo.csv", "E1D1NS.fcs", "20.8", "112", "501", "32.4", "93.7", "71.2", "59.6", "49.7", "462", "5.64", "39.8", "2.97", "138", "2.15", "1.02", "2.59", "1", "-0.26", "1", "1", "0.94", "2.27", "5.65", "1", "1"],
["demo.csv", "E1D1PI.fcs", "13.7", "65.9", "501", "33.5", "80.1", "55.8", "56.4", "40.4", "489", "4", "29.8", "2.65", "43.8", "90.2", "14", "4.48", "1", "-0.12", "5.64", "2.28", "0.63", "6.46", "19.6", "1", "23"],
["demo.csv", "E1D2NS.fcs", "13", "91", "596", "37.4", "61.1", "60.2", "102", "44.5", "315", "5.42", "34.7", "2.31", "136", "2.07", "1.3", "2.71", "1", "0.44", "1", "1", "1.12", "2.25", "4.34", "1", "1"],
["demo.csv", "E1D2PI.fcs", "9.42", "68", "536", "41.6", "39.4", "41.8", "89.1", "46.7", "325", "5.36", "27.1", "2.84", "39.1", "70.3", "20.2", "4.89", "1.1", "3.65", "157", "8.23", "1.87", "10.3", "47", "1", "364"],
["demo.csv", "E1D3NS.fcs", "23.2", "125", "389", "18.3", "85.9", "33.4", "32", "35.4", "347", "4.84", "21.8", "0.75", "255", "1.33", "2.45", "2.61", "1", "-0.15", "2.16", "1", "-0.19", "1.92", "4.09", "1", "1"],
["demo.csv", "E1D3PI.fcs", "12.2", "101", "419", "21.6", "78.5", "26.9", "34.9", "33.8", "345", "4.33", "21.1", "1.15", "107", "83.3", "18.2", "3.79", "1", "0.08", "4.37", "1", "-0.15", "5.49", "14.5", "1", "3.88"],
["demo.csv", "E1D4NS.fcs", "24.8", "177", "381", "18.8", "95.3", "40.4", "27.8", "32.1", "437", "5.66", "20.1", "0.23", "235", "1.45", "2.78", "2.82", "1", "-0.3", "2.52", "1", "-0.3", "1.65", "4.13", "1", "1"],
["demo.csv", "E1D4PI.fcs", "12.5", "130", "385", "20.5", "88.6", "30.4", "26.7", "33.2", "466", "4.57", "17.7", "0.027", "103", "105", "14", "3.64", "1", "-0.27", "2.17", "1", "-0.31", "3.55", "10.8", "1", "1.83"],
["demo.csv", "E1concat_1.fcs", "16.5", "88.3", "501", "32.9", "87.4", "62.9", "58", "44.9", "474", "4.82", "34.5", "2.79", "69.8", "16.2", "5.3", "3.42", "1", "-0.2", "1.67", "1", "0.8", "3.98", "10.1", "1", "1"],
["demo.csv", "E2D5NS.fcs", "16.1", "128", "179", "6.11", "91.3", "17.9", "17.2", "20.2", "276", "3.74", "15.7", "0.69", "327", "3.18", "N/A", "1.96", "1", "N/A", "N/A", "1", "-0.13", "48.8", "10.5", "1", "1"],
["demo.csv", "E2D5PI.fcs", "9.81", "91", "170", "7.05", "84.8", "14.7", "15.9", "17.8", "301", "2.99", "14", "-0.013", "108", "55.2", "N/A", "2.54", "1", "N/A", "N/A", "1.11", "-0.15", "44.4", "15.7", "1", "1"],
["demo.csv", "E2D6NS.fcs", "18.6", "149", "179", "8.23", "79.3", "19.2", "16.3", "22.7", "219", "4.79", "15.1", "-0.06", "433", "2.8", "N/A", "2.44", "1", "N/A", "N/A", "1", "-0.11", "36.4", "9.81", "1", "1"],
["demo.csv", "E2D6PI.fcs", "9.1", "85.1", "128", "10.1", "68.2", "15.4", "13.3", "22.2", "281", "2.76", "12.2", "-0.11", "105", "72.2", "N/A", "2.28", "1", "N/A", "N/A", "1", "-0.054", "45.8", "15.9", "1", "1"],
["demo.csv", "concat_1.fcs", "10.7", "96.6", "246", "15.2", "76.7", "22.4", "21.6", "27.1", "350", "3.57", "16", "0.13", "94.7", "81.1", "N/A", "3.05", "1", "N/A", "N/A", "1", "-0.15", "17.4", "14.5", "1", "1.7"]]

  describe(".config", () => {
    it("Set exclude column to '[CD7, CCR7]', Stitcher.config should be the same.", () => {
      const excludeCols = ["CD7", "CCR7"];
      Stitcher.config({
        excludeCols: excludeCols
      });
      expect(Stitcher.getConfig()).to.have.property("excludeCols", excludeCols);
    });
    it("Set exclude rows to '[E1D4PI.fcs, E2D6PI.fcs]', Stitcher.config should be the same.", () => {
      const excludeRows = ["E1D4PI.fcs", "E2D6PI.fcs"];
      Stitcher.config({
        excludeCols: [],
        excludeRows: excludeRows
      });
      expect(Stitcher.getConfig()).to.have.property("excludeRows", excludeRows);
    });
    it("Set negatives to '0', Stitcher.config should be the same.", () => {
      Stitcher.config({
        excludeCols: [],
        excludeRows: [],
        negative: "0"
      });
      expect(Stitcher.getConfig()).to.have.property("negative", "0");
    });
    it("Set empty to 'N/A', Stitcher.config should be the same.", () => {
      Stitcher.config({
        negative: undefined,
        empty: "N/A"
      });
      expect(Stitcher.getConfig()).to.have.property("empty", "N/A");
    });
    it("Set contains to 'PI', Stitcher.config should be the same.", () => {
      Stitcher.config({
        contains: "PI"
      });
      expect(Stitcher.getConfig()).to.have.property("contains", "PI");
    });
  });
  describe(".contains", () => {
    it("Filtering '20000' should only contain column headers.", () => {
      Stitcher.config({
        contains: "20000"
      });
      const filteredTmp = Stitcher.filterContains(testData);
      expect(filteredTmp).to.have.lengthOf(1);
    });
    it("Filtering 'PI' should contain data.", () => {
      Stitcher.config({
        contains: "PI"
      });
      const filteredTmp = Stitcher.filterContains(testData);
      expect(filteredTmp).to.have.length.above(1);
    });
  });
  describe(".stitch", () => {
    it("Stitching should return a larger matrix.", () => {
      const testData2 = [["Source", "Data", "CD7", "CCR7", "CD8", "CD11a", "CD27", "CD28", "CD29", "CD43", "CD45RA", "CD45RO", "CD49d", "CD57", "CD62L", "CD69", "CD107a", "GMCSF", "GzmB", "HLA-DR", "IFN-g", "IL-2", "KLRG1", "MIP1a", "MIP1b", "Perforin", "ButtHead"],
["demo2.csv", "123123.fcs", "20.8", "112", "501", "32.4", "93.7", "71.2", "59.6", "49.7", "462", "5.64", "39.8", "2.97", "138", "2.15", "1.02", "2.59", "1", "-0.26", "1", "1", "0.94", "2.27", "5.65", "1", "1"],
["demo2.csv", "add.fcs", "13.7", "65.9", "501", "33.5", "80.1", "55.8", "56.4", "40.4", "489", "4", "29.8", "2.65", "43.8", "90.2", "14", "4.48", "1", "-0.12", "5.64", "2.28", "0.63", "6.46", "19.6", "1", "23"],
["demo2.csv", "E1D2dawdaNS.fcs", "13", "91", "596", "37.4", "61.1", "60.2", "102", "44.5", "315", "5.42", "34.7", "2.31", "136", "2.07", "1.3", "2.71", "1", "0.44", "1", "1", "1.12", "2.25", "4.34", "1", "1"],
["demo2.csv", "E1adawD2PI.fcs", "9.42", "68", "536", "41.6", "39.4", "41.8", "89.1", "46.7", "325", "5.36", "27.1", "2.84", "39.1", "70.3", "20.2", "4.89", "1.1", "3.65", "157", "8.23", "1.87", "10.3", "47", "1", "364"],
["demo2.csv", "awdawd.fcs", "23.2", "125", "389", "18.3", "85.9", "33.4", "32", "35.4", "347", "4.84", "21.8", "0.75", "255", "1.33", "2.45", "2.61", "1", "-0.15", "2.16", "1", "-0.19", "1.92", "4.09", "1", "1"],
["demo2.csv", "dddd.fcs", "12.2", "101", "419", "21.6", "78.5", "26.9", "34.9", "33.8", "345", "4.33", "21.1", "1.15", "107", "83.3", "18.2", "3.79", "1", "0.08", "4.37", "1", "-0.15", "5.49", "14.5", "1", "3.88"],
["demo2.csv", "zxczc.fcs", "24.8", "177", "381", "18.8", "95.3", "40.4", "27.8", "32.1", "437", "5.66", "20.1", "0.23", "235", "1.45", "2.78", "2.82", "1", "-0.3", "2.52", "1", "-0.3", "1.65", "4.13", "1", "1"],
["demo2.csv", "E1D4PI.fcs", "12.5", "130", "385", "20.5", "88.6", "30.4", "26.7", "33.2", "466", "4.57", "17.7", "0.027", "103", "105", "14", "3.64", "1", "-0.27", "2.17", "1", "-0.31", "3.55", "10.8", "1", "1.83"],
["demo2.csv", "zxczxc.fcs", "16.5", "88.3", "501", "32.9", "87.4", "62.9", "58", "44.9", "474", "4.82", "34.5", "2.79", "69.8", "16.2", "5.3", "3.42", "1", "-0.2", "1.67", "1", "0.8", "3.98", "10.1", "1", "1"],
["demo2.csv", "E2D5NS.fcs", "16.1", "128", "179", "6.11", "91.3", "17.9", "17.2", "20.2", "276", "3.74", "15.7", "0.69", "327", "3.18", "N/A", "1.96", "1", "N/A", "N/A", "1", "-0.13", "48.8", "10.5", "1", "1"],
["demo2.csv", "zxc.fcs", "9.81", "91", "170", "7.05", "84.8", "14.7", "15.9", "17.8", "301", "2.99", "14", "-0.013", "108", "55.2", "N/A", "2.54", "1", "N/A", "N/A", "1.11", "-0.15", "44.4", "15.7", "1", "1"],
["demo2.csv", "vss.fcs", "18.6", "149", "179", "8.23", "79.3", "19.2", "16.3", "22.7", "219", "4.79", "15.1", "-0.06", "433", "2.8", "N/A", "2.44", "1", "N/A", "N/A", "1", "-0.11", "36.4", "9.81", "1", "1"],
["demo2.csv", "vvvv.fcs", "9.1", "85.1", "128", "10.1", "68.2", "15.4", "13.3", "22.2", "281", "2.76", "12.2", "-0.11", "105", "72.2", "N/A", "2.28", "1", "N/A", "N/A", "1", "-0.054", "45.8", "15.9", "1", "1"],
["demo2.csv", "wee.fcs", "10.7", "96.6", "246", "15.2", "76.7", "22.4", "21.6", "27.1", "350", "3.57", "16", "0.13", "94.7", "81.1", "N/A", "3.05", "1", "N/A", "N/A", "1", "-0.15", "17.4", "14.5", "1", "1.7"]]

      let tmp = testData;
      const previousSize = tmp.length;
      tmp = Stitcher.stitch([{filename: "test", csv: tmp}, {filename: "test2", csv: testData2}]);
      const newSize = tmp.length;
      expect(previousSize).to.be.lessThan(newSize);
    });
  });
});