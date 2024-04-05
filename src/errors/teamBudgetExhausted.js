/* eslint-disable require-jsdoc */
class TeamBudgetExhausted extends Error {
  constructor() {
    super('Team doesn\'t have enough budget to complete the bid !');
    this.name = 'TeamBudgetExhausted';
  }
}

module.exports = TeamBudgetExhausted;
