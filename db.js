var jsonfile = require("jsonfile");

module.exports = {
    get: function(file) {
        return new Promise((resolve, reject) => {
            jsonfile.readFile(__dirname + "/db/" + file, function(err, arr) {
                resolve(arr);
            });
        });
    },
    find: function(file, id) {
        return new Promise((resolve, reject) => {
            jsonfile.readFile(__dirname + "/db/" + file, function(err, arr) {
                i = arr.findIndex(x => x.id == id);
                resolve(arr[i]);
            });
        });
    },
    search: function(file, query) {
        return new Promise((resolve, reject) => {
            jsonfile.readFile(__dirname + "/db/" + file, function(err, arr) {
                i = [];
                for (var item of arr) {
                    if (item.name.includes(query)) {
                        i.push(item);
                    }
                }
                resolve(i);
            });
        });
    },
    add: function(file, obj) {
        jsonfile.readFile(__dirname + "/db/" + file, function(err, arr) {
            arr.push(obj);
            jsonfile.writeFile(__dirname + "/db/" + file, arr, function(err, resp) {
                return;
            });
        });
    },
    edit: function(file, id, obj) {
        jsonfile.readFile(__dirname + "/db/" + file, function(err, arr) {
            i = arr.findIndex(x => x.id == id);
            arr[i] = obj;
            jsonfile.writeFile(__dirname + "/db/" + file, arr, function(err, resp) {
                return;
            });
        });
    },
    remove: function(file, id) {
        jsonfile.readFile(__dirname + "/db/" + file, function(err, arr) {
            i = arr.findIndex(x => x.id == id);
            arr.splice(i, 1);
            jsonfile.writeFile(__dirname + "/db/" + file, arr, function(err, resp) {
                return;
            });
        });
    }
}