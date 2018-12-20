# Mosaic 3.0
Mosaic is a data visualization application for summary data that is developed by Engineering Interns at FlowJo, LLC.

### Index
1. [Features](#features)
2. [How to use](#How-to-Use-Mosaic)
    *  [Box and Whisker](#How-to-use-Box-and-Whisker)
    *  [Chord Diagram](#How-to-use-Chord-Diagram)
    *  [Clustergrammer](#How-to-use-Clustergrammer)
    *  [HeatMap](#How-to-use-HeatMap)
    *  [Minimum Spanning Tree](#How-to-use-Minimum-Spanning-Tree)
    *  [Stitching](#how-to-use-stitching)
3. [Screenshots](#screenshots)
4. [Development](#development)
5. [Previous Version](#previous-version)
6. [Authors](#authors)
7. [More Information](#More-information)
8. [License](#license)

### Features
* **View and Edit standard  CSV data**
* **Stitching multiple CSV files**
* **Multiple data visualizations**
* **Row/Col Tags CSV data**

```
Current available Visualizations:
1. Chord Diagram
2. Minimum Spanning Tree
3. Heatmap
4. Box and Whisker plot
5. Clustergrammar by MaayanLab
```

### How to Use Mosaic
1. Double click on Mosaic to start application.
2. Wait for spinning helix to dissapear and Mosaic to appear.
3. Once Mosaic appears, the table should have been filled with demo data.
    * The first Col and the first Row is reserved for Tags.
4. To open a file, click File in menu bar and click open, then select your desired CSV file.
    * Make sure the csv contains no metadata.
    * must contain headers for cols and rows.
5. Once data is loaded, you can edit any cell you desire, this won't modify your origin csv file.
6. When you want to visualize the data, click on the Graph tab which is located on the top of the application, under the menu bar.
7. Once the loading screen has gone away and a Visual is generated, you can now choose the desired visual and free to interact with the visualization.
8. On the left side will be a panel which displays the available visualizations and tags.
9. Tags are alias for cols/rows, it will group the cols/rows with the same tag and display them as a single row/col.
10. You can also exclude data by clicking on the visible button next to the tag name, this will exclude or include the tagged rows/cols.
11. Once you're finished manipulating the data to your interest, you can then save the data as a CSV file(.csv) or a Mosaic file(.mos) which contains the tags for your rows/cols.

### How to use Box and Whisker
1. Click on Box and Whisker icon on the left panel inside the Graph tab.
2. Double click on box to display all data points.
```
*note: Box and whisker works with Column Tags.
```

### How to use Chord Diagram
1. Click on Chord Diagram icon on the left panel inside the Graph tab.
```
*note: Chord Diagram works with Row and Column Tags.
```

### How to use Clustergrammer
1. Click on Clustergrammer icon on the left panel inside the Graph tab.
2. If you don't have python 2.x installed, it will display heatmap instead.
3. After the CLustergrammer is loaded, you are now free to change the opacity and sorting settings of the visual.
```
*note: Clustergrammer only works when you have python 2.x installed, make sure pip is available through path, mosaic will install dependencies through the pip module.

*note: Clustergrammer does not work with Tags.
```

### How to use HeatMap
1. Click on Clustergrammer icon to toggle bewteen Clustergrammer and Heatmap.
```
*note: Heatmap does not work with Tags.
```

### How to use Minimum Spanning Tree
1. Click on Minimum Spanning Tree icon on the left panel inside the Graph tab.
2. Select one or more column tags to generate links.
```
*note: Minimum Spanning Tree does not work with row tags.
```

### How to use Stitching
1. Open Stitching window under the Edit menu.
2. Click on Stitch
3. It should load with the current table data.
4. You can remove it from the open files box.
5. You can filter out rows that does not contain the indicated string inside the 'contains' option on the left.
6. You can export the stitched CSV to a csv file(tags will not be saved).
7. You can save the stitched CSV to the table.

### Screenshots
> **Mosaic Table** <br/>
<img src="browse/static/docs/images/table.png" alt="Mosaic" width="400"/>

> **Mosaic Table - adding Tags** <br/>
<img src="browse/static/docs/images/tablewtags.png" alt="Mosaic" width="400"/>

> **Mosaic Graph - Box and Whisker** <br/>
<img src="browse/static/docs/images/boxnwhisker.png" alt="Mosaic" width="400"/>

> **Mosaic Graph - Chord Diagram** <br/>
<img src="browse/static/docs/images/chorddiagram.png" alt="Mosaic" width="400"/>

> **Mosaic Graph - Minimum Spanning Tree** <br/>
<img src="browse/static/docs/images/mst.png" alt="Mosaic" width="400"/>

> **Mosaic Graph - Heatmap** <br/>
<img src="browse/static/docs/images/heatmap.png" alt="Mosaic" width="400"/>

> **Mosaic Graph - Clustergrammer** <br/>
<img src="browse/static/docs/images/clustergrammer.png" alt="Mosaic" width="400"/>

> **Mosaic Stitching** <br/>
<img src="browse/static/docs/images/stitching.png" alt="Mosaic" width="400"/>

> **Mosaic Stitching - Filtering** <br/>
<img src="browse/static/docs/images/stitchfilter.png" alt="Mosaic" width="400"/>


### Development
* [How to contribute](static/docs/CONTRIBUTING.md)

### Previous version
* [Mosaic 2.0](http://garrison.hq.flowjo.com:7990/projects/MOS/repos/mosaic/browse?at=refs%2Fheads%2FMosaic-1.0)

### Authors
* [Kevin Xu](www.linkedin.com/in/kevinjia-xu)
* [Morgan Loring](https://www.linkedin.com/in/morgan-loring)
* [Paul Wyatt](https://www.linkedin.com/in/pauljwyatt/)
* [Dayton Wilks]()

### Mosaic 2.0 Authors
* [Isaac Harries](https://www.linkedin.com/in/isaac-harries-99817980/)
* [Rusty Raymond](https://www.linkedin.com/in/rusty-raymond-0b5098129/)
* [Lake Sain-Thomason](https://www.linkedin.com/in/lakesainthomason/)

### More information
* [Mosaic User Manual](https://docs.google.com/document/d/1e_2FI32e_p1qcSM1T6RUrK8OU-kX1CXvXKb5AvQIqKI/edit?usp=sharing)

### License
```
No information
```