/**
 * Created by WangZheZen on 2/13/2017.
 */
///terms/{term}/examschedule
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
//function exam_schedule (subject,course_number)
//{
function get_list() {
    uwclient.get('/terms/1171/examschedule', function (err, res) {
        if (!err) {
            console.log(get_courses(res.data));
        }
    });
//}}
}

function get_courses(res){
    var arr=[];
    var re_1=/ +/g;
    for (var i =0;i<res.length;i++){
        arr.push(res[i].course);
            //.replace(re_1,""));

    }
    return arr.join('\n');
}
 function prerequire(sub1,sub2){
    var subject = sub2.match(/\w*/g)[0];
    var number =sub2.match(/(\d\w?)+/g)[0];
    //var list = get_requirement(subject,number);
     uwclient.get('/courses/'+subject + '/'+number+'/prerequisites', function (err, res) {
         if (!err) {
      //       console.log(subject,number);
         check(res.data.prerequisites_parsed,sub1,sub2)}});}

function get_requirement(subject,course_num){
    uwclient.get('/courses/'+subject + '/'+course_num+'/prerequisites', function (err, res) {
        if (!err) {
           return (res.data.prerequisites_parsed);
        }
    });
}
function  check (list,sub1,sub2) {
    if (list.indexOf(sub1)!= -1)
    {
    console.log(sub1+" is "+sub2+" requirements.");

}
else{
    console.log(sub1+" is not "+sub2+" requirements.");
}}
prerequire("MATH148","MATH 148");
