/* eslint-disable require-jsdoc */
class DocumentNotFoundError extends Error {
  constructor(docType) {
    const msg = docType ?
      `${docType} document not found !` :
      'Document with given id not found !';
    super(msg);
    this.name = 'DocumentNotFoundError';
  }
}

module.exports = DocumentNotFoundError;
