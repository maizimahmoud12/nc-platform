const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'fnc.json');

function readCases() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '[]', 'utf8');
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    console.error('Erreur lecture base JSON:', error);
    return [];
  }
}

function writeCases(cases) {
  fs.writeFileSync(DB_PATH, JSON.stringify(cases, null, 2), 'utf8');
}

module.exports = { readCases, writeCases };
