/**
 * Created by WangZheZen on 2/17/2017.
 */
/**
 * Created by WangZheZen on 2/17/2017.
 */
var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function get_prof_photo (route) {

var options ={

    url:route,
    method:"GET"

};

function callback(error, response, body) {
   var re_1=/(http.*?\.jpg)|(http.*?\.png)|(http.*?\.jepg)/g;
    if (!error && response.statusCode == 200) {
         var text_1 = body.match(re_1);
     //    var text_2 = text_1.match(re_2);

     //    console.log( encodeURI(text_2[0]));
         console.log(text_1);
    }
    else {
        console.log(body);
        console.log(response);
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

var arr=[1,1,2,4,51,2,2,4,5];
//console.log(filter(arr));\


get_prof_photo('https://cs.uwaterloo.ca/about/people/jmatlee');