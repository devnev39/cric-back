module.exports.player = {
  name: 'text',
  country: 'text',
  playingRole: 'text',
  iplMatches: 'number',
  cua: 'text',
  basePrice: 'number',
  ipl2022Team: 'text',
  auctionedPrice: 'number',
  imgUrl: 'url',
  totalRuns: 'number',
  battingAvg: 'number',
  strikeRate: 'number',
  wickets: 'number',
  economy: 'number',
};

module.exports.tempUser = {
  Name: 'text',
  Email: 'email',
  Expiry: 'date',
  Enabled: 'checkbox',
};

module.exports.team = {
  Name: 'text',
  Budget: 'number',
};

module.exports.auction = {
  Name: 'text',
  MaxBudget: 'number',
  Password: 'password',
  Adminid: 'password',
  MaxPlayers: 'Number',
  AllowPublicTeamView: 'checkbox',
};

module.exports.publicAuctionViewModel = {
  name: 'text',
  maxBudget: 'number',
  _id: 'text',
  status: 'text',
};

module.exports.AuctionViewModelAdmin = {
  _id: 'text',
  name: 'text',
  maxBudget: 'number',
  status: 'text',
  maxPlayers: 'Number',
  allowPublicTeamView: 'checkbox',
  allowLogin: 'checkbox',
  allowRealTimeUpdates: 'checkbox',
};

module.exports.PlayerRuleModel = {
  BasePrice: 'number',
  AuctionedPrice: 'number',
  SoldPrice: 'number',
};

module.exports.TeamRuleModel = {
  Budget: 'number',
  Current: 'number',
  AuctionMaxBudget: 'number',
};
