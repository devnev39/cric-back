const error = (res,code,data) => {
    res.json({status : code,data : data});
}
module.exports = error;