function getValueList(query, params) {
  let count = 0;
  const values = [];
  const text = query.replace(/\{\{(.*?)\}\}/g, function(match, token) {
    values.push(getNested(params, token.split('.')));
    return `$${++count}`;
  });
  return { text, values }
}

function getNested(obj, multiKey) {
  const [key, ...remaining] = multiKey;
  if (remaining < 1) {
    return obj[key];
  }
  else {
    return getNested(obj[key], remaining);
  }
}

function setNested(obj, multiKey, value) {
  const [key, ...remaining] = multiKey;
  if (remaining.length < 1) {
    obj[key] = value;
  } else {
    if (!obj[key]) {
      obj[key] = {};
    }
    setNested(obj[key], remaing, value);
  }
}

module.exports.getValueList = getValueList;
module.exports.getNested = getNested;
module.exports.setNested = setNested;
