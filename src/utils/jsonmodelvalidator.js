module.exports = (modelJson, shcemaJson, neglect) => {
  const keys = Object.keys(modelJson);
  let result = true;
  const neglects = neglect || [];
  Object.keys(shcemaJson).forEach((key) => {
    if (
      key[0] != '_' &&
      keys.indexOf(key) == -1 &&
      neglects.indexOf(key) == -1
    ) {
      result = key;
    }
  });
  return result;
};
