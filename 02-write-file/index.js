const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'text.txt')

const output = fs.createWriteStream(fileName);

const { stdin, stdout } = process;
stdout.write('\n*** Пожалуста, введите ваши данные:\n');
let resText = '';
stdin.on('data', data => {
    let curText = data.toString();
    if (curText.toUpperCase() === 'EXIT\r\n') {
        process.exit();
    } else {
        resText += curText;
        output.write(curText);
    }

});

process.on('SIGINT', () => {
    process.exit();
});
process.on('exit', () => {
    stdout.write('\n*** Файл записан.\r\nДо свидания, спасибо за сотрудничество!\r\n')
});



// const input = fs.createReadStream('source.txt', 'utf-8');
// const output = fs.createWriteStream('destination.txt');

// input.on('data', chunk => output.write(chunk));
// input.on('error', error => console.log('Error', error.message));
