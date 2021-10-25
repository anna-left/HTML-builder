const fs = require('fs');
const path = require('path');

const oldDirectory = path.join(__dirname, 'files')
const newDirectory = path.join(__dirname, 'files-copy')

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

// const directoryPath = `${__dirname}/test`;

createDirectory(newDirectory).then((path) => {
    console.log(`Successfully created directory: '${path}'`);
    selectFiles();




}).catch((error) => {
    console.log(`Problem creating directory: ${error.message}`)
});

function selectFiles() {
    fs.readdir(oldDirectory, (err, files) => {
        if (err) {
            console.log(err);

        } else {
            files.forEach(file => {
                let curFile = path.join(oldDirectory, file);

                fs.stat(curFile, function (err, stats) {
                    if (stats.isFile()) {

                        const newFile = path.join(newDirectory, file);
                        copyFile(curFile, newFile);

                        // const ext = path.extname(curFile);
                        // const name = path.basename(curFile, ext);
                        // const size = stats["size"];
                        // console.log(`${name} - ${ext.substring(1)} - ${size}kb`);
                    }
                })
            });
        }
    })
}

// function copyFile(source, target, cb) {
function copyFile(source, target) {
    let cbCalled = false;

    let rStream = fs.createReadStream(source, 'utf-8');
    rStream.on("error", function (err) {
        console.log(err);
        //done(err);
    });
    let wStream = fs.createWriteStream(target, 'utf-8');
    wStream.on("error", function (err) {
        console.log(err);
        // done(err);
    });
    wStream.on("close", function (ex) {
        done();
    });
    rStream.pipe(wStream);
}

