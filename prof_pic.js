/**
 * Created by WangZhe on 2/20/2017.
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
    database : 'prof_profile'
});
connection.connect();
// Module for collecting professors' photos
exports.search_prof = function search_prof(name, prof){
    var options = {
        url: "https://uwaterloo.ca/search?q=" + encodeURIComponent(name) + "&btnG=Search&client=default_frontend&proxystylesheet=default_frontend&ulang=en&sort=date%3AD%3AL%3Ad1&entqr=3&entqrm=0&wc=200&wc_mc=1&oe=UTF-8&ie=UTF-8&ud=1&site=default_collection",
        method: "GET",
        headers: {
            "Host": "uwaterloo.ca"
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var re_1 = /\d\..*?href.*?\<\/a\>/g;
            var re_2 = /http.*?\"/g;
            var text_1 = body.match(re_1);
            var list_1 = [];
           if (text_1){
                for (var i = 0; i < text_1.length; i++) {
                    if (text_1[i].match(re_2)) {
                        var lis = text_1[i].match(re_2);
                        for (var n = 0; n < lis.length; n++) {
                            list_1.push(valid_url(lis[n].replace(/"/g, "")));
                        }
                    }
                }
                all_url_extract(name, list_1, 0, prof);
           }
        }
    }
    request(options, callback);
};
function all_url_extract(name, array, i, prof) {
    for (var n = 0; n < array.length; n++){
        extract_pic(name, array, array[n], prof);
    }
    if (i<=array.length) {
        (extract_pic(name, array, array[i], i, prof));
    }
}

function extract_pic(name, array, route, a, prof) {
    var options = {
        url: route,
        method: "GET"
    };
    function callback(error, response, body) {
        var re_1 = /(http.*?\.jpg)|(http.*?\.png)|(http.*?\.jpeg)/g;
        var re_cs = /(src.*?\.jpg)|(src.*?\.png)|(src.*?\.jpeg)/g;
        var re_src = /(src.*jpg$)|(src.*png$)|(src.*jpeg$)/g;
        var re_src_res = /(".*?jpg$)|(".*?png$)|(".*?jpeg$)/g;
        var name_list = name.match(/\w+/g);
        var first_name = name_list[0].toLowerCase();
        var middle_name;
        var last_name;
        var res_list = [];
        if (name_list.length > 2) {
            middle_name = name_list[1].toLowerCase();
            last_name = name_list[1].toLowerCase();
        }
        else {
            last_name = name_list[1].toLowerCase();
            middle_name = name_list[1].toLowerCase();
        }
        console.log(first_name + ":" + middle_name);
        console.log(prof);
        if (!error && response.statusCode == 200) {
            var text_1 = body.match(re_1);
            var cs_text = body.match(re_cs);
            if (text_1) {
                for (var i = 0; i < text_1.length; i++) {
                    var text_2 = valid_url(text_1[i]);
                    if (text_2) {
                        var res = text_2.match(re_1);
                        if (res && text_2 && res[0]) {
                            if (res[0].indexOf(first_name) != -1 ||
                                res[0].indexOf(middle_name) != -1 ||
                                res[0].indexOf(last_name) != -1) {
                                res_list.push(res[0]);
                            }
                        }
                    }
                }
            }
            if (cs_text) {
                for (var h = 0; h < cs_text.length; h++) {
                    if (cs_text[h].match(re_src)) {
                        var cs_1 = cs_text[h].match(re_src)[0];
                        if (cs_1.match(re_src_res)) {
                            var cs_2 = cs_1.match(re_src_res)[0];
                            cs_1 = cs_2.replace(/"/g, "");
                            var cs_ress = url.resolve(route, cs_1);
                             if (related(cs_ress, first_name, middle_name, last_name)) {
                                res_list.push(cs_ress);
                            }
                        }
                    }
                }
            }
            if (res_list.length > 0) {
                if(prof){
                   face_list.get_gender(res_list, prof, 0);
                    for (var v = 0; v < res_list.length; v++){
                            prof.url.push(res_list[v]);
                            console.log(prof.name + " : " + res_list[v]);
                            jsonfile.writeFile('prof_profiles-5.json', prof, {flag: 'a', spaces: ','}, function () {
                        });
                    }
                }
                 else {
                    console.log(" no profile");
                 }
            }
            else{
                all_url_extract(name, array,a+1);
                extract_pic(name,array,array[a+1],a+1,prof);
            }
    }}
    request(options, callback);
}
function valid_url(str) {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    var res = str.indexOf("logo") == -1 && str.indexOf("mark") == -1;
    if (res&&str.match(regex)) {
        return (str.match(regex)[0]);
    }
}
function related(url, first, middle, last) {
    if (middle) {
        return url.indexOf(first.toLowerCase()) != -1 ||
            url.indexOf(middle.toLowerCase()) != -1 ||
            url.indexOf(last.toLowerCase()) != -1;
    }
    else {
        return url.indexOf(first.toLowerCase()) != -1;
    }
}
 function get_prof () {
     jsonfile.readFile('prof_profiles-3.json', function(err, obj) {
         for(var i = 0; i < 10; i++){
             obj.data[i].url = [];
           search_prof(obj.data[i].name, obj.data[i]);
         }
     });
}