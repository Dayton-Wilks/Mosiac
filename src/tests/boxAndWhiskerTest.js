/**
 * Author: Morgan Loring
 * Email: morganl@flowjo.com
 */

const expect = require('chai').expect;

import AllTags from '../components/datastructure/allTags';

const testData = [
    ['CellID', 'col1', 'col2', 'col3'],
    ['1', 1, 2, 3],
    ['2', 4, 5, 6],
    ['3', 7, 8, 9]
]

const dataObjects = [
    [   
        {g: "col1", Value: 1},
        {g: "col1", Value: 4},
        {g: "col1", Value: 7}
    ],
    [
        {g: "col2", Value: 2},
        {g: "col2", Value: 5},
        {g: "col2", Value: 8}
    ],
    [
        {g: "col3", Value: 3},
        {g: "col3", Value: 6},
        {g: "col3", Value: 9}
    ]
]

const coltags_testInput = [
    {tagName: "a", defaultName: "col1", enabled: false, visible: true},
    {tagName: "col2", defaultName: "col2", enabled: false, visible: true},
    {tagName: "a", defaultName: "col3", enabled: false, visible: true}
];

const rowTags_testInput = [    
    {tagName: "gene1", defaultName: "gene1", enabled: false, visible: true},
    {tagName: "gene2", defaultName: "gene2", enabled: false, visible: true},
    {tagName: "gene3", defaultName: "gene3", enabled: false, visible: true}
];


describe('Make data array to object array', () => {
    it('should make the data objects to be passed to the box and whisker plot', () => {
        var all = new AllTags();

        all.table = testData;
        all.rowTags.tags = rowTags_testInput;
        all.columnTags.tags = coltags_testInput;
        all.state = { columnTags: coltags_testInput , rowTags: rowTags_testInput};


        var data = all.createBoxAndWhiskerMatrix();

        expect(data).to.deep.equal(dataObjects);
    });
});
