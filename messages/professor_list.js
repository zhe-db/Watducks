/**
 * Created by WangZheZen on 2/17/2017.
 */
var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function extract_info(array){
    for (var i=0;i<array.length;i++){
var options ={

  url:"https://uwflow.com/course/"+array[i],
    method:"GET"

};

function callback(error, response, body) {
    var re_1= /professor_id.*?, "/g;
    var re_2= /:.*?,/g;
    var re_3=/".*?"/g;
    var re_4=/".*?"/g;
    var re_5=/\w+/g;
    if (!error && response.statusCode == 200) {

        if(body.match(re_1)){
       var text_1 = body.match(re_1).join("");
       if(text_1.match(re_3)){
       var text_2 = text_1.match(re_2).join("");
       if (text_2.match(re_3)){
       var text_3=text_2.match(re_3).join("");
       if (text_3.match(re_5)){
       var text_4=text_3.match(re_5);
        console.log(filter(text_4));
    }}}}}
    else {

    }
}
request(options, callback);}}
function filter (array) {
    var list =[];
    for (var i=0;i<array.length;i++){
        if (!list.includes(array[i])){
            list.push(array[i]);
        }

    }
    return list;
}

function get_course(){
uwclient.get('/courses',function (err,res) {
    if (!err){
      sort_courses(res.data);
    }});

function sort_courses (list){
    var arr=[];
    for (var i =0;i<list.length;i++){
        arr.push(list[i].subject.toLowerCase()+list[i].catalog_number);
    }
    extract_info(arr);
}
}
    get_course();
