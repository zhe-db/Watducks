/**
 * Created by WangZhe on 2/10/2017.
 */

var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
// Module for listing all the courses in University of Waterloo
exports.list_course = function list_course(){
    uwclient.get('/courses',function (err,res) {
        if (!err){
            extract (sort_courses(res.data));
        }
    });
    function sort_courses (list) {
            var arr = [];
            for (var i = 0; i < list.length; i++){
                arr.push(list[i].subject + " " + list[i].catalog_number);
            }
            return arr;
    }
    function sort_subject (list){
        var arr = [];
        for (var i = 0; i < list.length; i++){
            arr.push(list[i].subject);
        }
        return arr.join("\n");
    }
};
