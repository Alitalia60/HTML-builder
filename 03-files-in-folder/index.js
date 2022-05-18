const { readdir, stat } = require('fs/promises');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fList = async function getFileList(secretFolder) {
    try {
        const files = await readdir(secretFolder);
        for (const file of files) {
            fInfo(path.join(secretFolder, file));
        }
    } catch (err) {
        console(err)
    }
}

fInfo = async function(file) {
    try {
        const stats = stat(file);
        console.log(stats);
        if (stats.isFile) {
            console.log(`${path.basename(file)}-${path.extname(file)}-${stats.size}`);
            // console.log(stats.size);
        }
    } catch (err) {
        console.log(err);
    }
}
fList(secretFolder)


/* <имя файла>-<расширение файла>-<вес файла> */