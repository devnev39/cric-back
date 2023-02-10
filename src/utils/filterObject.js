module.exports = (obj,filter) => {
    let filterObj = {};
    Object.keys(filter).forEach(key => filterObj[key] = obj[key]);
    return filterObj;
}