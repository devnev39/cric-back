/**
 * Asynchronously executes a function and handles any errors that occur.
 *
 * @param {Function} func - The function to execute.
 * @param {any} errcode - The error code to return in case of an error.
 * @return {Promise} A promise that resolves with the execution result or an error object.
 */
const trywrapper = async (func, errcode) => {
  try {
    return await func();
  } catch (error) {
    console.log(error);
    return {status: false, errorCode: errcode, data: error.message};
  }
};
module.exports = trywrapper;
