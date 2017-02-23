/**
 * Created by tonyz on 1/21/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function getcourse (str){
    var re1=/([A-Z])\w+/g;
 return str.match(re1);
};
function getcourse_id (str){

    var reid=/\d+\w?/g;
    return str.match(reid);
};

var strt="CS-136,MATH-148,MATH-136,JPAN-101R,";

function examschedule(arr_name,arr_id){
    var oder1="";
    var str1="";
    for (var i=0;i<arr_name.length;i++){
        oder1="/courses/"+arr_name[i]+"/"+arr_id[i]+"/schedule";
        console.log(oder1);
        uwclient.get(oder1, function(err, res) {
            console.log(cousrsetitle(JSON.stringify(res)));
        });}
        return str1;}
function check_course (entity){
        for (var i=0;i<entity.length;i++){
          switch  (entity[i].type){
              case "course_number":
                 var  number = entity[i].entity;
               //  console.log(number);
                  break;
              case "course_code":
                 var code = entity[i].entity;
              //   console.log(code);
                  break;

          }
    }
        course_info(code,number);
}

function course_info (course_code,course_number) {
    (uwclient.get("/courses/"+course_code+"/"+ course_number,function (err,res) {
        console.log(res);
        console.log("title: "+res.data.title);
        console.log("description: "+res.data.description);
        console.log("prerequisites: "+res.data.prerequisites);
        console.log("antirequistes: "+res.data.antirequisites);
        console.log("url: "+res.data.url);

    }))
}
var entity_1 =[ { entity: '135',
    type: 'course_number',
    startIndex: 5,
    endIndex: 7,
    score: 0.971493065,
    resolution: {} },
    { entity: 'math',
        type: 'course_code',
        startIndex: 0,
        endIndex: 3,
        score: 0.906870365,
        resolution: {} },
    { entity: '135',
        type: 'builtin.number',
        startIndex: 5,
        endIndex: 7,
        score: 0.8995081,
        resolution: {} },
    { entity: '02',
        type: 'builtin.number',
        startIndex: 17,
        endIndex: 18,
        score: 0.883653164,
        resolution: {} } ];

check_course(entity_1);