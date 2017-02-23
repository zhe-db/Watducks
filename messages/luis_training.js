/**
 * Created by WangZheZen on 2/16/2017.
 */
var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});

// https://westus.api.cognitive.microsoft.com/luis/v1.0/prog/apps/{appId}/actionChannels
// appid : ae60bd7a-97ad-4dd3-925d-44b2db7fcd17
// subscription key :
//7a78a990591f446e8c594
// programmtic key:8b87344ccdc04519915f5e69a21788c1

function train_course (obj) {
    var options = {
        url: "https://westus.api.cognitive.microsoft.com/luis/v1.0/prog/apps/ae60bd7a-97ad-4dd3-925d-44b2db7fcd17/example",
        method: 'POST',
        headers: {
            // "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": '8b87344ccdc04519915f5e69a21788c1'

        },
        body: JSON.stringify({
            "ExampleText": obj.content,
            "SelectedIntentName": "check_course",
            "EntityLabels": [
                {
                    "EntityType": "course_code",
                    "StartToken": obj.course_code.start,
                    "EndToken": obj.course_code.end
                },
                {
                    "EntityType": "course_number",
                    "StartToken": obj.course_number.start,
                    "EndToken": obj.course_number.end
                }
            ]
        })
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
        else {
            console.log(body);
            console.log(response);
        }
    }

    request(options, callback);
}
function course_obj (course){
    var str = course;
    var re_code =/\w+?\s/g;
    var re_space =/\s+/g;
    var re_number =/\d+.*$/g;
    var course_code={};
    course_code.content = str.match(re_code)[0].replace(re_space,"");
    course_code.start =str.indexOf(course_code.content);
    course_code.end = course_code.start + course_code.content.length;
    var course_number ={};
    if (str.match(re_number))
    {course_number.content = str.match(re_number)[0];
    course_number.start =str.indexOf(course_number.content);
    course_number.end = course_number.start + course_number.content.length;}
    else {
        course_number.content = "";
        course_number.start =0;
        course_number.end =0;

    }
    var res={};
    res.content = str;
    res.course_code = course_code;
    res.course_number =course_number;
    train_course(res);}
function start_train_courses() {
    uwclient.get('/courses',function (err,res) {
        if (!err){
            (sort_courses(res.data));
        }});
}
function sort_courses (list){
    var arr=[];
    for (var i =0;i<list.length;i++){
         course_obj(list[i].subject+" "+list[i].catalog_number);
    }
}

start_train_courses();