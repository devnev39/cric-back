// Reads json files and returs json object
const fs = require("fs/promises");

readJson = async () => {
    const files = await fs.readdir(path.join(__dirname, "..", "..", "data"));
    if(files.length == 0 || files.length > 1){ }
    if(!files[0].endsWith(".json")){ }
    const read = await fs.readFile(path.join(__dirname,"..","..","data",files[0]));
    return JSON.parse(read);
}

module.exports = readJson;