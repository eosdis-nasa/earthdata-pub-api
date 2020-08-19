module.exports.permission = {
  in: (item) => {
    const { id, ...entity } = item;
    return {
      id,
      table_name: Object.keys(entity)[0].slice(0, -3),
      entity_id: Object.values(entity)[0]
    }
  },
  out: (item) => {
    return {
      id: item.id,
      [`${item.table_name}_id`]: item.entity_id
    }
  }
}

module.exports.subscription = {
  in: (item) => {
    const { id, ...source } = item;
    return {
      id,
      table_name: Object.keys(source)[0].slice(0, -3),
      entity_id: Object.values(source)[0]
    }
  },
  out: (item) => {
    return {
      id: item.id,
      [`${item.table_name}_id`]: item.source_id
    }
  }
}
