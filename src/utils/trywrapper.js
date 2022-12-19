const trywrapper = async (func,errcode) => {
    try {
        return await func();
    } catch (error) {
        return {status : errcode,data : error.message};
    }
}
module.exports = trywrapper;