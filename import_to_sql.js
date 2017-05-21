/**
 * Created by surfacebook on 5/6/2017.
 */
var request = require('request');
var validUrl = require('valid-url');
var jsonfile = require('jsonfile');
var face_list = require('./face_list_management');
var cheerio = require('cheerio');
var url = require('url');
var sql_client = require('./sql_client');
var mysql= require('mysql');
var connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});
connection.connect();
// Module for Updating data to MySQL database
// update face_id
exports.insert_face_id = function insert_face_id(name, faceid){
    connection.query('update ignore prof_profiles set face_id = ' + '"' + faceid + '"' +
        'where name =' + '"' + name + '"',
        function (error, results, fields) {
        if (error) throw error;
        if(results) console.log(results);
    });
};
// Update person_id
exports.insert_id = function insert_person_id (name, personid){
    connection.query('update ignore prof_profiles set person_id = ' + '"' + personid + '"' +
        'where name =' + '"' + name + '"', function (error, results, fields) {
        if (error) throw error;
        if(results) console.log(results);
    });
};
// Update person_id with course data
exports.update_person_id = function update_person_id(name, course){
    connection.query('update ignore prof_profiles set course_data = IFNULL(concat(course_data,' + '"' + course + '"' + '),'+'"'+course+'"'+')'+' where name ='+'"'+name+'"', function (error, results, fields) {
        if (error) throw error;
        if(results) console.log(results);
    });
    function update_course_info(){
        jsonfile.readFile('prof_profiles-4.json', function (err, obj) {
           for (var i = 0; i < obj.data.length; i++ ){
                   if(obj.data[i].name.indexOf('<') == -1){
                       var course_data = obj.data[i].course + "-" + obj.data[i].section + "&";
                      update_person_id(obj.data[i].name, course_data);
                   }
           }
        });
    }};
// Getting all data from database for migration
exports.select_all = function select_all_data_from_db () {
    connection.query('select * from prof_profiles limit 4000', function (error, results, fields) {
        if (error) throw error;
        if(results) {
            console.log(results);
            jsonfile.writeFile('prof_profiles_8.json',results,function(){});
            for (var i = 0; i < results.length; i++) {
                        var prof = {};
                        prof.name = results[i].name;
                        prof.course_data = results[i].course_data;
                        if(results[i].pic_urls){
                            var array = results[i].pic_urls.split(',');
                            insert_request(array,prof,i);
                        }}
        }
    });
};
// Establishing the whole databse
exports.insert_request = function insert_request (array, prof, i) {
    setTimeout(function(){
        face_list.create_person('1365221911', prof, array);
    }, i * 500);
};
// Inserting urls
function insert_url (name, url) {
    connection.query('update prof_profiles set pic_urls =' + '"' + url + '"' + ' where name =' + '"' + name + '"', function (error, results, fields) {
        if (error) throw error;
        if(results) console.log(results);
    });
}
// Updating urls
exports.update_url = function update_url(){
    jsonfile.readFile('prof_profiles-4.json',function (err, obj) {
        for (var i = 0; i < 10; i++ ){
            if(obj.data[i].name.indexOf('<') == -1) {
                if (obj.data[i].url) {
                    var pic_url = String((obj.data[i].url));
                    console.log(pic_url);
                    insert_url(obj.data[i].name, pic_url);
                }
            }
        }
    });
};