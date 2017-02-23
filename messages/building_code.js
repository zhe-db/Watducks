/**
 * Created by WangZheZen on 2/10/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});

uwclient.get('/courses/CS/136/examschedule',function (err,res) {
    if (!err){
       console.log((res.data));
    }});

function sort_buildings (list){
    var arr=[];
    for (var i =0;i<list.length;i++){
        arr.push(list[i].building_code+" "+number(1000,6000));
    }
    return arr.join("\n");
}
function sort_subject (list){
    var arr=[];
    for (var i=0;i<list.length;i++){
        arr.push(list[i].subject);
    }
    return arr.join("\n");
}
function number (bottom, top) {
        return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;

}