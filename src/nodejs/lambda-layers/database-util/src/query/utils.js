
const pubCleanString = (dirtyString) => {
    const cleanString = dirtyString.replace(/'/g, "''");
    return cleanString;
}

module.exports.pubCleanString = pubCleanString;