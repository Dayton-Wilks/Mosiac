/*
* Author: Jiawei Xu
* File: index.js
* Description:
* -> Panel control for stitching.
* -> offers filtering and file opening.
*/

import React from "react";
import Stitcher from "../../../../../../lib/stitching";

const FileViewer = props => (
    <div className='fileviewer'>
        <div className='filecontrol'>
            <span>Files</span>
            <input type="file" name="stitchfiles" id="stitchfiles" onChange={props.fileChange} accept=".csv, .tsv, .xlsx, .xls" multiple/>
            <label htmlFor="stitchfiles" className='stitchfileslabel'>+</label>
        </div>
        <div ref={ref=>{props.setFileList(ref)}} className='filelist'>
        </div>
    </div>
)

//forwardRef - pass down reference
const Filter = React.forwardRef((props,refs) => (
    (<div className='filter'>
        <span className="filterheader">Filter</span>
        <div className="filteroptions">
            <div className="filteroption contains">
                <a href="#" ref={refs[0]} className="foptions">Contains</a>
                <div className="s-contains s-excluded-header s-excluded-header-hidden">
                    <input onChange={props.filterContain} onFocus={props.setPrevContainValue} onBlur={props.setPreserveRowTags} type="text" placeholder="row name includes..."/>
                </div>
            </div>
            <div className="filteroption contains">
                <a href="#" className="foptions s-export" onClick={props.export}>Export to CSV</a>
            </div>
        </div>
    </div>)
))

class Panel extends React.Component {
    constructor(props) {
        super(props);
        this.prevContainValue = "";
        this.setListener = false;
        this.filelist = React.createRef();
        this.foptions = [React.createRef(), React.createRef()];
        this.fileChange = this.fileChange.bind(this);
        this.expandFilterOption = this.expandFilterOption.bind(this);
        this.filterContain = this.filterContain.bind(this);
        this.setPrevContainValue = this.setPrevContainValue.bind(this);
    }
    expandFilterOption(e) {
        e.target.nextSibling.classList.toggle("s-excluded-header-hidden");
        e.target.classList.toggle("s-option-active");
    }
    componentDidMount() {
        if (!this.setListener) {
            for(let i = 0; i < 1; ++i) {
                const ref = this.foptions[i].current;
                ref.addEventListener("click", this.expandFilterOption);
            }
        }
    }
    setPrevContainValue(e) {
        this.prevContainValue = e.target.value;
    }
    componentWillUnmount() {
        if (this.setListener) {
            for(let i = 0; i < this.foptions.length; ++i) {
                const ref = this.foptions[i].current;
                ref.removeEventListener("click", this.expandFilterOption);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextStates) {
        let shouldUpdate = false;
        if (nextProps !== this.props) shouldUpdate = true;
        if (nextStates !== this.state) shouldUpdate = true;
        return shouldUpdate
    }
    filterContain(e) {
        Stitcher.config({
            contains: e.target.value
        });
        this.props.saveCurrentTags(undefined,undefined,{default: e.target.defaultValue, previous: this.prevContainValue, current: e.target.value});
        this.props.setUpdateTable(!this.props.UPDATE_TABLE);
    }
    fileChange(e) {
        if (e.target.files.length > 0) {
            if (!(this.props.STITCH_FILES.includes(e.target.files[0].path))) {
                this.props.openStitchFile(e.target.files);
            }
            for(let i = 0; i < e.target.files.length; ++i) {
                this.props.addOpenedFile(e.target.files[i].name,this.props.getFileList(), e.target.files[i].path);
            }
        }
    }
    render() {
        return (
            <div className='panel'>
                <FileViewer fileChange={this.fileChange} setFileList={this.props.setFileList}/>
                <Filter ref={this.foptions} export={this.props.EXPORT} filterContain={this.filterContain} setPrevContainValue={this.setPrevContainValue} setPreserveRowTags={this.props.setPreserveRowTags}/>
                <button className="stitchsavebtn" onClick={this.props.saveData}>SAVE</button>
            </div>
        )
    }
}

export default Panel;