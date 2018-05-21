const fs = require('fs');
const path = require('path');

function loadData(dataFolder) {
  let malcolmMessages = {};

  findFilesRecursively(dataFolder).filter(f => f.includes('request_')).forEach(file => {
    const request = JSON.parse(fs.readFileSync(file).toString());
    delete request.id;
  
    const response = JSON.parse(fs.readFileSync((file).replace('request_', 'response_')).toString());
    delete response.id;
  
    malcolmMessages[JSON.stringify(request)] = response;
  });

  return malcolmMessages;
}

function findFilesRecursively(directory) {
  const allFilesAndFoldersInDirectory = fs.readdirSync(directory).map(f => path.join(directory, f))
  let filesInDirectory = allFilesAndFoldersInDirectory.filter(p => !fs.lstatSync(p).isDirectory())

  const directories = allFilesAndFoldersInDirectory.filter(p => fs.lstatSync(p).isDirectory()).forEach(d => {
    const subfiles = findFilesRecursively(d);
    filesInDirectory = [...filesInDirectory, ...subfiles];
  })

  return filesInDirectory;
}

module.exports = {
  loadData
}
