//#!/usr/bin/env node
var jsonFile = require('jsonfile');
var getJson = require('d3').json;

var url = process.argv[2],
    filename = process.argv[3];

getJson(url, function(json){
    jsonFile.writeFile(filename, json, function(err){
        console.log(err);
    })
});