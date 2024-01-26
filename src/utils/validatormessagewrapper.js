module.exports = validatormessagewrapper = (func, json, model, neglect) => {
  const result = func(json, model, neglect);
  return result != true ?
    `Insufficient data , ${result}${neglect ? ` , leaving ${neglect} ` : ' '} !` :
    true;
};
