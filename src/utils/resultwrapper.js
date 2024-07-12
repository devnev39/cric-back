/**
 * Asynchronously executes a function with a parameter and sends the result as a JSON response.
 *
 * @param {Function} func - The function to execute.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {any} param - The parameter to pass to the function.
 * @return {Promise} A promise that resolves with the JSON response.
 */
module.exports = async (func, req, res, param) => {
  const result = await func(param);
  res.json(result);
};
