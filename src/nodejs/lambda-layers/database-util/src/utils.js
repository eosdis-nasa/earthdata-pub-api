function getNested(obj, multiKey) {
  const [key, ...remaining] = multiKey;
  if (remaining < 1) {
    return obj[key];
  }

  return getNested(obj[key], remaining);
}

function setNested(obj, multiKey, value) {
  const [key, ...remaining] = multiKey;
  if (remaining.length < 1) {
    obj[key] = value;
  } else {
    if (!obj[key]) {
      obj[key] = {};
    }
    setNested(obj[key], remaining, value);
  }
}

function getValueList(query, params) {
  let count = 0;
  const values = [];
  const text = query.replace(/\{\{(.*?)\}\}/g, (match, token) => {
    values.push(getNested(params, token.split('.')));
    count += 1;
    return `$${count}`;
  });
  return { text, values };
}

module.exports.getValueList = getValueList;
module.exports.getNested = getNested;
module.exports.setNested = setNested;
