/**
 * Created by WangZheZen on 2/24/2017.
 */
var mysql= require('mysql');
var prof=require('./prof_pic');
var face_list = require('./face_list_management');

var connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});

connection.connect();
function insert_profile (name, course, section){
    connection.query('insert into prof_profiles(name,course,section) values('+'"'+name+'"'+','+'"'+course+'"'+','+'"'+section+'"'+')', function (error, results, fields) {
        if(results) console.log(results);
        else console.log(error);
    });
}
exports.fix_get_profile = function fix_get_profile (array,name){
    connection.query('select * from prof_profiles where name ='+"'"+name+"'", function (error, results, fields) {
        if (error) throw error;
        if (results){
            for(var i = 0;i < results.length; i++){
                prof.search_prof(results[i].name);
            }
            var prof = {};
             prof.name = (results[0].name);
             prof.course = (results[0].course);
             prof.section = (results[0].section);
            face_list.get_gender(array,prof,0);
        }
    });
};

function update_person_id(name, course, section, id){
    connection.query('update profiles set person_id = '+'"'+id+'"'+'where name ='+'"'+name+'"'+'&& course ='+'"'+course+'"'+'&& section ='+'"'+section+'"', function (error, results, fields) {
        if (error) throw error;
        if(results) console.log(results);
    })}
function test () {
    connection.query('select name from profiles', function (error, results, fields) {
        if (error) throw error;
        if (results){
            for(var i = 0; i < results.length; i++){
           prof.search_prof(results[i].name);
        }}
    });
}
function insert_pic (group_id){
    connection.query('select name,person_id from profiles', function (error, results, fields) {
        if (error) throw error;
        if (results){
            for(var i = 0; i < results.length; i++){
               var res = results[i];
               prof.search_prof(res.name, res.person_id, group_id);
            }}
    });
}
