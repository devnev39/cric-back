// Upload file filter checks for the file object or the player object

const error = require('../utils/error');
const path = require('path');
const Player = require('../models/player');
const {playerValidator} = require('../utils/validatemodel');
const ERRORCODE = 310;

const upload = async (req, res, next) => {
  if (req.body.player) {
    if (
      (valid = playerValidator(req.body.player, ['IMGURL', 'SRNO'])) != true
    ) {
      error(res, ERRORCODE, valid);
      return;
    }
    const result = Player.find({SRNO: req.body.player.SRNO});
    if (result.length) {
      error(res, ERRORCODE, 'Cannot create player with existing Sr.No. !');
      return;
    }
    next();
    return;
  }
  if (req.files && Object.keys(req.files).length != 0) {
    const file = req.files.files;
    try {
      await file.mv(path.join(__dirname, '..', '..', file.name));
      next();
    } catch (err) {
      console.log(err);
      error(res, ERRORCODE, err);
    }
  } else {
    error(res, ERRORCODE, 'No file or player object found !');
  }
};

module.exports = upload;
