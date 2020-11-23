const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require('path');

var sql = function(db, table) {
    exec("./dbsake frmdump " + table, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));

        } else {
            /* Is a file */
            if (file.indexOf('.frm') > -1)
            results.push(file);
        }
    });
    return results;
}

let data = walk('data');

data.forEach(function(file) {

    var table = path.parse(file).name;
    var db = path.parse(path.dirname(file)).name;

    if (!fs.existsSync('dumps/' + db)) {
        execSync('mkdir dumps/' + db);
    }

});

data.forEach(function(file) {

    var table = path.parse(file).name;
    var db = path.parse(path.dirname(file)).name;


    execSync("~/dbsake frmdump " + file + " >> dumps/" + db + "/" + db + ".sql 2>&1", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(db + " sql dumped");
            return stdout;
    });
    var filename = file.split('.').slice(0, -1).join('.');
    if (fs.existsSync(filename + '.ibd'))
    execSync('cp ' + filename + '.ibd dumps/' + db);
});

data.forEach(function(file) {

    var table = path.parse(file).name;
    var db = path.parse(path.dirname(file)).name;

    fs.appendFileSync('dumps/' + db + '/' + db + '_discard.sql', 'ALTER TABLE ' + table + ' DISCARD TABLESPACE;');
    fs.appendFileSync('dumps/' + db + '/' + db + '_import.sql', 'ALTER TABLE ' + table + ' IMPORT TABLESPACE;');
});
