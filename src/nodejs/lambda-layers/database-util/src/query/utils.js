
const pubCleanString = (dirtyString) => {
    if (dirtyString) return dirtyString.replace(/'/g, "''");
    return dirtyString;
}

module.exports.pubCleanString = pubCleanString;