const dotenv = require("dotenv");
const path = require("path")

dotenv.config()

const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const dirPath = __dirname

module.exports ={ PORT, SECRET, path, dirPath }