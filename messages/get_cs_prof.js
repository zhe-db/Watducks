/**
 * Created by WangZheZen on 2/17/2017.
 */

var request = require("request");

var options ={
  url:"https://cs.uwaterloo.ca/about/people/group/",
  method:"GET"



};
function callback(error, response, body) {
    // var re_1=/image" content=".*/g;
    // var re_2=/http.*?.jpg/g;
    if (!error && response.statusCode == 200) {
        // var text_1 = body.match(re_1).join("");
        // var text_2 = text_1.match(re_2);
        // var text_3=text_2.match(re_3).join("");
        console.log(body);
    }
    else {
        console.log(body);
        console.log(response);
    }
}

request(options, callback);

function get_prof_photo (route) {

    var options ={

        url:route,
        method:"GET"

    };

    function callback(error, response, body) {
        var re_1=/image" content=".*/g;
        var re_2=/http.*?.jpg/g;
            var re_1=/(http.*?\.jpg)|(http.*?\.png)|(http.*?\.jepg)/g;
            if (!error && response.statusCode == 200) {
                var text_1 = body.match(re_1);
                console.log(text_1);}
        else {
            console.log(error);
        }
    }

    request(options, callback);}
function filter (array) {
    var list =[];
    for (var i=0;i<array.length;i++){
        if (!list.includes(array[i])){
            list.push(array[i]);
        }

    }
    return list;
}
