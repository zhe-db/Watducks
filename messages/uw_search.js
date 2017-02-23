/**
 * Created by WangZheZen on 2/18/2017.
 */
var request = require('request');
var validUrl = require('valid-url');

function search_prof (name){
var options ={
    url:"https://uwaterloo.ca/search?q="+encodeURIComponent(name)+"&btnG=Search&client=default_frontend&proxystylesheet=default_frontend&ulang=en&sort=date%3AD%3AL%3Ad1&entqr=3&entqrm=0&wc=200&wc_mc=1&oe=UTF-8&ie=UTF-8&ud=1&site=default_collection",
    method:"GET",
    headers:{
        "Host": "uwaterloo.ca"
    }};
function callback(error, response, body) {

    if (!error && response.statusCode == 200) {
        var re_1 = /\d\..*?href.*?\<\/a\>/g;
        var re_2 =/http.*?\"/g;
        var text_1=body.match(re_1);
        var list_1 =[];

        for (var i=0;i<text_1.length;i++){
            if (text_1[i].match(re_2)){

            list_1.push(text_1[i].match(re_2)[0].replace(/"/g,""));}
        }
        get_all_prof(list_1);
       // console.log(list_1);
    }
    else {
        // console.log(body);
        // console.log(response);
    }
}

request(options, callback);}
//search_prof("Sibel Alumur Alev");
function get_prof_photo (route) {
    var options ={
        url:route,
        method:"GET"
    };
    function callback(error, response, body) {
        var re_1=/(http.*?\.jpg)|(http.*?\.jepg)/g;
        var res=[];
        if (!error && response.statusCode == 200) {
            var text_1 = body.match(re_1);
            //    var text_2 = text_1.match(re_2);
            if (text_1) {
                for (var i = 0; i < text_1.length; i++) {
                        res.push(text_1[i]);

                }
                //    console.log( encodeURI(text_2[0]));
                console.log(res);
            }
        }
        else {
          //  console.log(body);
            //console.log(response);
        }
    }
    request(options, callback);}

function get_all_prof (array) {
    var list=[];
    for (var i=0;i<array.length;i++){
            list.push(get_prof_photo(array[i]));


    }
    console.log(list);
}
search_prof("Ian Goldberg");
//get_prof_photo( 'https://uwaterloo.ca/centre-automotive-research/people-profiles/sibel-alumur-alev');
//get_prof_photo('https://uwaterloo.ca/management-sciences/about/people/salumura');