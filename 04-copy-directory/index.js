const fs = require('fs');
const path = require('path');
const { stdout } = process;

const oldDirectory = path.join(__dirname, 'files')
const newDirectory = path.join(__dirname, 'files-copy')

// создаем новую директорию
createDirectory(newDirectory).then((path) => {
    stdout.write(`\n*** Новая директория создана: ${path}\n`);
    // если директория создана - выбираем файлы из нее
    selectFiles();

}).catch((error) => {
    console.log(`Problem creating directory: ${error.message}`)
});

function createDirectory(newDirectory) {
    const directory = path.normalize(newDirectory);

    return new Promise((resolve, reject) => {
        fs.stat(directory, (error) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.mkdir(directory, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(directory);
                        }
                    });
                } else {
                    reject(error);
                }
            } else {
                resolve(directory);
            }
        });
    });
}

// выбираем файлы из указанной директории
function selectFiles() {
    fs.readdir(oldDirectory, (err, files) => {
        if (err) {
            console.log(err);

        } else {
            files.forEach(file => {
                let curFile = path.join(oldDirectory, file);

                fs.stat(curFile, function (err, stats) {
                    // нам нужны только файлы
                    if (stats.isFile()) {
                        // копируем файл в новую директорию
                        const newFile = path.join(newDirectory, file);
                        copyFile(curFile, newFile);

                    }
                })
            });
        }
    })
}

function copyFile(source, target) {
    let cbCalled = false;

    fs.createReadStream(source).pipe(fs.createWriteStream(target));
    stdout.write(`\n*** Файл скопирован:          ${target}\n`);

}




