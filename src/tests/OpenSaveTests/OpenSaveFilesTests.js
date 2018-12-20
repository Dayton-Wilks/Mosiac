
const expect = require('chai').expect;
const openCSV = require('../../../helper/workers/openFile');
const util = require('util');

import Path from 'path';
import getExpectedCSVData from './expectedCSVData';
import getExpectedMOSData from './expectedMOSData';
import { writeCSV, writeMOS } from '../../helper/func/saveFile';
import { openMOS } from '../../helper/func/openFile';
import fs from 'fs';

describe('Open file test', () => {
    it('Should open a CSV file, read data, and compare to expected', () => {
        let csvCallback = (data) => {
            expect(JSON.stringify(data.csv)).to.equal(JSON.stringify(getExpectedCSVData()));
            expect(data.err).to.equal(undefined);
        }

        openCSV('.' + Path.sep + 'src' + Path.sep + 'tests' + Path.sep + 'OpenSaveTests' + Path.sep + 'MOCK_DATA.csv', csvCallback)
    });

    it('Open a MOS file, read data, compare to expected', () => {
        let mosCallback = (data) => {
            let expected = getExpectedMOSData();

            expect(data).to.deep.equal(expected);
        }

        openMOS('.' + Path.sep + 'src' + Path.sep + 'tests' + Path.sep + 'OpenSaveTests' + Path.sep + 'MOCK_DATA.mos', mosCallback);
    });
});

describe('Save file test', () => {
    it('Save new csv file', () => {
        let saveCSVCallback = (outputFile) => {
            expect(fs.existsSync(outputFile)).to.equal(true);
            fs.unlinkSync(outputFile);
        }

        writeCSV('.' + Path.sep + 'src' + Path.sep + 'tests' + Path.sep + 'OpenSaveTests' + Path.sep + 'test_write.csv', getExpectedCSVData(), saveCSVCallback);
    });

    it('Save new mos file', () => {
        let saveMOSCallback = (outputFile) => {
            expect(fs.existsSync(outputFile)).to.equal(true);
            fs.unlinkSync(outputFile);
        }

        writeMOS('.' + Path.sep + 'src' + Path.sep + 'tests' + Path.sep + 'OpenSaveTests' + Path.sep + 'test_write.mos', getExpectedCSVData(), saveMOSCallback);
    });
});