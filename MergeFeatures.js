var jsonFile  = require('jsonfile');
var path = require('path');

function readToBuffer(filename, callback){
    jsonFile.readFile(path.resolve(__dirname, filename), function(err, obj){
        if (err) throw err;
        callback(obj);
    });
}

function mergeFeatures(filenames, newFilename){
    var count = filenames.length,
        readCount = 0,
        maps = [],
        merge = function(){
            var map = maps[0];
            for(var i = 1; i < count; i++){
                map.features = map.features.concat(maps[i].features)
            }
            jsonFile.writeFile(newFilename, map, function(err){
                if (err) throw err;
            })
        };
    for(var i = 0; i < count; i++){
        readToBuffer(filenames[i], function(map){
            maps.push(map);
            readCount++;
            if (readCount == count){
                return merge();
            }
        })
    }
}

mergeFeatures([process.argv[2], process.argv[3]], process.argv[process.argv.length - 1]);