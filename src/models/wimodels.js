module.exports.player = {
    Name : "text",
    Country : "text",
    PlayingRole : "text",
    IPLMatches : "number",
    CUA : "text",
    BasePrice : "number",
    IPL2022Team : "text",
    AuctionedPrice : "number",
    IMGURL : "url",
    TotalRuns: "number",
    BattingAvg: "number",
    StrikeRate: "number",
    Wickets: "number",
    Economy: "number"
}

module.exports.tempUser = {
    Name : "text",
    Email : "email",
    Expiry : "date",
    Enabled : "checkbox"
}

module.exports.team = {
    Name : "text",
    Budget : "number"
}

module.exports.auction = {
    Name : "text",
    MaxBudget : "number",
    Password : "password",
    Adminid : "password",
    MaxPlayers: "Number",
    AllowPublicTeamView: "checkbox"
}

module.exports.publicAuctionViewModel = {
    Name : "text",
    MaxBudget : "number",
    No : "number",
    _id : "text",
    Status : "text"
}

module.exports.AuctionViewModelAdmin = {
    _id: "text",
    Name: "text",
    MaxBudget: "number",
    No : "number",
    Status: "text",
    MaxPlayers: "Number",
    AllowPublicTeamView: "checkbox",
    AllowLogin: "checkbox"
}

module.exports.PlayerRuleModel = {
    BasePrice : "number",
    AuctionedPrice : "number",
    SoldPrice : "number"
}

module.exports.TeamRuleModel = {
    Budget : "number",
    Current : "number",
    AuctionMaxBudget : "number"
}