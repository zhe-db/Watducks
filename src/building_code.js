/**
 * Created by WangZhe on 2/10/2017.
 */

var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});

// This is automation test for LUIS to identify building code by random generating existing building code
//  and uploaded to LUIS database for it to identify by machine learning

// generate random building codes
exports.generate_building_code = function generate_buildings (list){
    var arr=[];
    for (var i =0;i<list.length;i++){
        arr.push(list[i].building_code+" "+number(1000,6000));
    }
    return arr.join("\n");
};

// list all existing subjects
exports.generate_course_code = function geneate_subject (list){
    var arr=[];
    for (var i=0;i<list.length;i++){
        arr.push(list[i].subject);
    }
    return arr.join("\n");
};

// Generate Random Number
function number (bottom, top) {
        return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}