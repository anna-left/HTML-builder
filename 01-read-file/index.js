const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'text.txt')

const stream = fs.createReadStream(fileName, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log('\n*** Содержимое файла:\n', data));
stream.on('error', error => console.log('****Error', error.message));