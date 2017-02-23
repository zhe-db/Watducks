/**
 * Created by WangZheZen on 2/20/2017.
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
                    list_1.push(valid_url(text_1[i].match(re_2)[0].replace(/"/g,"")));}
            }
            all_url_extract(name,list_1);
        }

        else {
            console.log(body);
            console.log(response);
        }
    }
    request(options, callback);}
    function all_url_extract (name,array){
        for (var i=0;i<array.length;i++){
            (extract_pic(name,array[i]));

        }
    }
    function extract_pic (name,route){
        var options ={
            url:route,
            method:"GET"
        };
        function callback(error, response, body) {
            var re_1 = /(http.*?\.jpg)|(http.*?\.png)|(http.*?\.jepg)/g;
            var name_list =name.match(/\w+/g);
            var first_name = name_list[0].toLowerCase();
            var middle_name;
            var last_name;
            var res_list=[];
            if (name_list.length>2){
                middle_name = name_list[1].toLowerCase();
                last_name =name_list[2].toLowerCase();
            }
            else {
                last_name =name_list[1].toLowerCase();
                middle_name =name_list[1].toLowerCase();
            }

            if (!error && response.statusCode == 200) {
                var text_1 = body.match(re_1);
                if (text_1) {
                    for (var i=0;i<text_1.length;i++) {
                        var text_2=valid_url(text_1[i]);
                        if (text_2){
                            var res = text_2.match(re_1);
                            if (res&&text_2&&res[0]){
                                if (res[0].indexOf(first_name)!=-1||res[0].indexOf(middle_name)!=-1||res[0].indexOf(last_name)!=-1){
                                    res_list.push(res[0]);}
                            }
                        }}
                }
            }
            else {
                //  console.log('gg');
                //  console.log(response);
            }
            if (res_list.length>0){
                console.log( res_list);
            }}
        request(options, callback);
    }
    function valid_url (str) {
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        var res = str.indexOf("logo")== -1 && str.indexOf("mark")== -1;
        if (res){
            return (str.match(regex)[0]);}}

search_prof("Ian Goldberg");