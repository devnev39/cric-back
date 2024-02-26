const error = (res, code, data) => {
  res.json({status: false, errorCode: code, data: data});
};
module.exports = error;
