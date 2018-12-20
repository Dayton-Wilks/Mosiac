/*
* Author: Jiawei Xu
* File: index.js
* Description:
* -> Stitching library for mosaic that combines two files.
* -> Automatic append missing rows and cols.
* -> Manual options such as filtering and configurations.
*/
import {remote} from "electron";
import url from "url";
import path from "path";


export function openStitchingWindow(filepath, data, setIsStitchWindowActive) {
	setIsStitchWindowActive(true);
    let stitchingWIndow = new remote.BrowserWindow({
		parent: remote.getCurrentWindow(),
        resizable: true,
        width: 870,
		height: 600,
		show: false,
		center: true,
        webPreferences: {
			nodeIntegrationInWorker: true
        },
        title: "Mosaic - Stitching"});
    if (process.env.ELECTRON_ENV === 'development') {
		stitchingWIndow.webContents.openDevTools({mode: "detach"});
	}
	stitchingWIndow.setMenu(null);
    stitchingWIndow.loadURL(url.format({
			pathname: path.join(remote.app.getAppPath(), "helper/stitching/index.html"), // eslint-disable-line no-undef
			protocol: "file:",
		slashes: true
	}));
	stitchingWIndow.webContents.on('will-navigate', e => {
		e.preventDefault();
	});
	stitchingWIndow.on("ready-to-show", () => {
		const dataLength = data.length;
		const dataMatrix = [];
		const rowTags = [];
		const filename = filepath.replace(/^.*[\\\/]/, '');
		let colTags = [];
		if (Array.isArray(data[0])) {
			colTags = data[0].map((elem)=>elem);
			let i = dataLength - 1;
			if (colTags.length > 0) {
				colTags.unshift("");
				while (i !== 0) {
					const zeroBaseIndex = dataLength - i;
					const dataColSize = data[zeroBaseIndex].length;
					const dataMatrixRow = [];
					let ii = dataColSize - 1;
					rowTags.push(data[zeroBaseIndex][0]);
					while(ii !== 0) {
						const subZeroBaseIndex = dataColSize - ii;
						dataMatrixRow.push(data[zeroBaseIndex][subZeroBaseIndex]);
						--ii;
					}
					dataMatrix.push(dataMatrixRow);
					--i;
				}
			}
		}
		stitchingWIndow.webContents.send("message", JSON.stringify({
			rowTags: rowTags,
			colTags: colTags,
			data: dataMatrix, 
			path: filepath, 
			name: filename
		}));
		stitchingWIndow.show();
	});
	stitchingWIndow.on("closed", () => {
		stitchingWIndow.destroy();
		stitchingWIndow = null;
		setIsStitchWindowActive(false);
	});
}