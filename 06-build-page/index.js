const fs = require('fs');
const path = require('path');
const { stdout } = process;

const cssFolder = path.join(__dirname, 'styles')
const projFolder = path.join(__dirname, 'project-dist')
const styleFile = path.join(projFolder, 'style.css');
const oldDirectoryAssets = path.join(__dirname, 'assets')
const newDirectoryAssets = path.join(projFolder, 'assets')
let arr = [];
const components = path.join(__dirname, 'components')
const indexFile = path.join(projFolder, 'index.html');
const templateFile = path.join(__dirname, 'template.html');
const header = path.join(components, 'header.html');
const articles = path.join(components, 'articles.html');
const footer = path.join(components, 'footer.html');

// создаем новую директорию project-dist
createDirectory(projFolder).then((path) => {
    stdout.write(`*** Новая директория создана: ${path}\n`);
    //создаем новый файл style.css ('w' - открыть файл для записи; при этом существующие данные затираются)
    fs.open(styleFile, 'w', (err) => {
        if (err) throw err;
        stdout.write(`*** Создан файл               ${styleFile}\n`);

        appendToFile();
    });
}).catch((err) => {
    throw err;
    console.log(`Problem creating directory: ${error.message}`)
});

// создаем новую директорию project-dist/assets
createDirectory(newDirectoryAssets).then((path) => {
    stdout.write(`*** Новая директория создана: ${path}\n`);
    // если директория создана - выбираем файлы из нее
    selectFiles(oldDirectoryAssets, newDirectoryAssets);

}).catch((error) => {
    console.log(`Problem creating directory: ${error.message}`)
});

// выбираем файлы из указанной директории
function selectFiles(directory, newDirectory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log(err);

        } else {
            files.forEach(file => {
                let curFile = path.join(directory, file);

                fs.stat(curFile, function (err, stats) {
                    // нам нужны только файлы
                    if (stats.isFile()) {
                        // копируем файл в новую директорию
                        const newFile = path.join(newDirectory, file);
                        copyFile(curFile, newFile);
                    }
                    else {
                        // создаем новую поддиректорию в каталоге project-dist/assets
                        const newFile = path.join(newDirectory, file);
                        createDirectory(newFile).then((path) => {
                            stdout.write(`*** Новая директория создана: ${path}\n`);
                            // выбираем файлы и копируем в новый каталог
                            selectFiles(curFile, newFile);
                        }).catch((error) => {
                            console.log(`Problem creating directory: ${error.message}`)
                        });
                    }
                })
            });
        }
    })
}

function copyFile(source, target) {
    let cbCalled = false;

    fs.createReadStream(source).pipe(fs.createWriteStream(target));
    stdout.write(`*** Файл скопирован:          ${target}\n`);

}

function createDirectory(folder) {
    const directory = path.normalize(folder);

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

// дописываем данные в созданный файл стилей
function appendToFile() {
    //читаем исходный каталог
    fs.readdir(cssFolder, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            files.forEach(file => {
                let curFile = path.join(cssFolder, file);
                fs.stat(curFile, function (err, stats) {
                    if (stats.isFile()) {
                        const ext = path.extname(curFile);
                        if (ext === '.css') {
                            fs.readFile(curFile, 'utf8', (err, data) => {
                                if (err) throw err;
                                // новые данные дописываем в конец файла
                                fs.appendFile(styleFile, data, (err) => {
                                    if (err) throw err;
                                    stdout.write(`*** Добавлены данные из файла ${curFile}\n`);
                                });
                            });
                        }
                    }
                })
            });
        }
    })
}

// формируем файл index.html
let nameHeader = path.basename(header, '.html');
let nameArticles = path.basename(articles, '.html');
let namefooter = path.basename(footer, '.html');

fs.copyFile(templateFile, indexFile, (err) => {
    if (err) throw err;
    fs.readFile(header, 'utf8', function (err, dataHeader) {
        if (err) throw err;
        fs.readFile(articles, 'utf8', function (err, dataArticles) {
            if (err) throw err;
            fs.readFile(footer, 'utf8', function (err, dataFooter) {
                if (err) throw err;
                fs.readFile(indexFile, 'utf8', function (err, dataIndex) {
                    if (err) throw err;
                    dataIndex = dataIndex.replace(`{{${nameHeader}}}`, dataHeader);
                    dataIndex = dataIndex.replace(`{{${nameArticles}}}`, dataArticles);
                    dataIndex = dataIndex.replace(`{{${namefooter}}}`, dataFooter);
                    fs.writeFile(indexFile, dataIndex, 'utf8', function (err) {
                        if (err) return console.log(err);
                        stdout.write(`*** Сформирован файл          ${indexFile}\n`);
                    });
                });
            });
        });
    });
});