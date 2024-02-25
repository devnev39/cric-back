/* eslint-disable require-jsdoc */
class DocumentNotFoundError extends Error {
  constructor() {
    super('Document with given id not found !');
    this.name = 'DocumentNotFoundError';
  }
}

module.exports = DocumentNotFoundError;
