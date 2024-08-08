const path = require("path")
const fs = require("fs")
const filePath = path.join(__dirname, "../db/users.json")

const writeToJSONFile = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
        console.log("Error: ", error)
    }
}

const readJSONFile = () => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8')
            return JSON.parse(data)
        } 
        return []
    } catch (error) {
        console.log(`Error is ${error}`)
        return []
    }
}

module.exports = {
    readJSONFile, writeToJSONFile
}