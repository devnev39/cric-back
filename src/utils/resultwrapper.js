module.exports = async (func, req, res, param) => {
  const result = await func(param);
  res.json(result);
};
