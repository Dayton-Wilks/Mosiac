/** ****************************************************************************
/* Name: Lake Sain-Thomason
/* email: lakes@flowjo.com
/* Date: 08/31/2017
/* Description: Contains a collection of Tag objects. The Mosaic application
/* requires two of these collections, one for the tags in the rows and one
/* for the columns.
/* Modified: Dayton Wilks
***************************************************************************** */
class Tags {
  constructor() {
    this.tags = [];
  }

  /** **************************************************************************
  * Function: getUserSetTags
  * Description: Gets tags set by the user
  * Parameters: NA
  * Returns: NA
  *************************************************************************** */
  getUserSetTags() {
    const setTags = [];
    const tagNames = [];
    for (let i = 0; i < this.tags.length; i += 1) {
      if (
        !tagNames.includes(this.tags[i].tagName) &&
        this.tags[i].tagName !== this.tags[i].defaultName
      ) {
        setTags.push(this.tags[i]);
        tagNames.push(this.tags[i].tagName);
      }
    }
    return setTags;
  }

  /** **************************************************************************
  * Function: toggleEnable
  * Description: Toggles a tag between true and false
  * Parameters: tagName to toggle
  * Returns: NA
  *************************************************************************** */
  toggleEnable(tagName) {
    for (let i = 0; i < this.tags.length; i += 1) {
      if (this.tags[i].tagName === tagName) {
        this.tags[i].enabled = !this.tags[i].enabled;
      }
    }
    return this.tags;
  }

   /** **************************************************************************
  * Function: toggleVisble
  * Description: Toggles a tags visibility between true and false
  * Parameters: tagName to toggle
  * Returns: NA
  *************************************************************************** */
 toggleVisible(tagName) {
  for (let i = 0; i < this.tags.length; i += 1) {
    if (this.tags[i].tagName === tagName) this.tags[i].visible = !this.tags[i].visible;
  }
  return this.tags;
}


  /** **************************************************************************
  * Function: addTag
  * Description: Adds a tag given the name and the tag locations in the row
  * Parameters: string tagName, array of indicies
  * Returns: the tags array
  *************************************************************************** */
  addTag(tagName, indicies, enable) {
    for (let i = 0; i < indicies.length; i += 1) {
      if (tagName === '' || tagName === null) {
        this.tags[indicies[i]].tagName = this.tags[indicies[i]].defaultName;
      } 
      else if (tagName == this.tags[indicies[i]].defaultName) {
        this.tags[indicies[i]].tagName = ' ' + this.tags[indicies[i]].defaultName
      }
      else {
        this.tags[indicies[i]].tagName = tagName;
      }
      this.tags[indicies[i]].enabled = enable;
    }
    return this.tags;
  }

  /** **************************************************************************
  * Function: initializeTag
  * Description: Same as add tag, just sets the default name as well
  * Parameters: string tagName, array of indicies
  * Returns: the tags array
  *************************************************************************** */
  initializeTag(tagName, indicies, enable = false, dataVisible = true) {
    for (let i = 0; i < indicies.length; i += 1) {
      let name = (tagName === '' || tagName === null) ? (indicies[i] + 1) : tagName;
      this.tags[indicies[i]] = { 
        tagName: name,
        defaultName: name,
        enabled: enable,
        visible: dataVisible
      };
    }
    return this.tags;
  }

  /** **************************************************************************
  * Function: getUniqueTags
  * Description: Gets all unique tag names
  * Parameters:
  * Returns: Array of unique tags
  *************************************************************************** */
  getUniqueTags() {
    const uniqueTags = [];
    for (let i = 0; i < this.tags.length; i += 1) {
      if (!uniqueTags.includes(this.getTagName(i))) {
        uniqueTags.push(this.getTagName(i));
      }
    }
    return uniqueTags;
  }

    /** **************************************************************************
  * Function: getUniqueVisibleTags
  * Description: Gets all unique tag names that are visible
  * Parameters:
  * Returns: Array of unique tags, all of which are visible
  *************************************************************************** */
  getUniqueVisibleTags() {
    const uniqueTags = [];
    for (let i = 0; i < this.tags.length; i++) {
      if (this.tags[i].visible && !uniqueTags.includes(this.tags[i].tagName)) {
        uniqueTags.push(this.tags[i].tagName);
      }
    }
    return uniqueTags;
  }

  /** **************************************************************************
  * Function: getIndiciesWithTag
  * Description: Gets all the unique indicies associated with a tagName
  * Parameters: string tagName, int startIndex
  * Returns: array of indicies assocaited with a tagName
  *************************************************************************** */
  getIndiciesWithTag(tagName, startIndex = 0) {
    const indicies = [];
    for (let i = startIndex; i < this.tags.length; i += 1) 
      if (this.getTagName(i) === tagName) indicies.push(i);
    
    return indicies;
  }

  /** **************************************************************************
  * Function: getTagName
  * Description: Gets the tag name dependant on whether its enabled or not
  * Parameters: i index
  * Returns: String tagName
  *************************************************************************** */
  getTagName(i) {
    return (this.tags[i].enabled) ?
      this.tags[i].tagName : this.tags[i].defaultName;
  }

  getTags() {
    return this.tags;
  }
}

export default Tags;
