/**
 * Created by WangZheZen on 3/4/2017.
 */
var face_list = require('./face_list_management');
var prof=require('./prof_pic');
var mysql = require('mysql');
var sql_client = require('./sql_client');
var connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});
// Module for testing
//connection.connect();
// Tests:
    //face_list.get_gender("https://www.student.cs.uwaterloo.ca/~cs136/images/veronika.jpg",{'name':'Veronika Irvine','course':'CS 136','section':'003'});
    //face_list.create_group('uw000','UW','Test');
    //face_list.create_group('uw00','UW','UW');
    //face_list.list_person_in_persongroup('uw00m');

    //prof.search_prof('Stephen New',{"name":'Stephen New',"course":"Math 145","section":"003"});
    //face_list.get_group('uw0002');
    //prof.search_prof('Tompkins Dave');
    //face_list.get_gender('https://cs.uwaterloo.ca/~dtompkin/dtompkins.jpg');

    //face_list.create_group('uw00f','Prof_Profiles_Female','Profiles for female professors in UW');
    //face_list.get_group('uw0f');
    //prof.search_prof('Mann,Shari');
    //var p ={};
    //console.log(p);
    //prof.search_prof('Fisher,Jacob');
    //face_list.list_person_in_persongroup('uw00m');
    //face_list.get_group('uw00f');
    //prof.search_prof('Balaban,Steven J.');
    //face_list.delete_group('uw00f');
    //face_list.get_group('uw00m')
    //prof.search_prof('Kevin G. Lamb')
    //face_list.list_person_in_persongroup('uw00f');