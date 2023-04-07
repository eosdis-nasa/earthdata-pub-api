

const pubCleanJSON = (dirtyJSON) => {

    let cleanJSON = dirtyJSON.replace(/'/g, "\\'");
    cleanJSON = cleanJSON.replace(/\\"/g, '\\\\"');
    return cleanJSON;
}

const pubCleanString = (dirtyString) => {
    const cleanString = dirtyString.replace(/'/g, "\'");
    return cleanString;
}

module.exports.pubCleanString = pubCleanString;
module.exports.pubCleanJSON = pubCleanJSON;