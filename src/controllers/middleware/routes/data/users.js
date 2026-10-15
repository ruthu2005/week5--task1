const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "users.json");

function readUsers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

module.exports = { readUsers, saveUsers };