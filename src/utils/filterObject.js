module.exports = (obj, filter) => {
  const filterObj = {};
  Object.keys(filter).forEach(
      (key) => (filterObj[key] = obj[key] ? obj[key] : null),
  );
  return filterObj;
};
