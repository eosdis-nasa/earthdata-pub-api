module.exports.permission = {
  in: (item) => {
    const { id, ...entity } = item;
    return {
      id,
      table_name: Object.keys(entity)[0].slice(0, -3),
      entity_id: Object.values(entity)[0]
    };
  },
  out: (item) => ({
    id: item.id,
    [`${item.table_name}_id`]: item.entity_id
  })
};
