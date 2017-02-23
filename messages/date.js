/**
 * Created by tonyz on 1/21/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var date=""
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function get_date(){
    var result;
(uwclient.get('/server/time', function (err,res) {
    function a (res) {
       result =res;
           //get_time(JSON.stringify(res.data.datetime));
    }}
))
return result
}
function get_time(str) {
 return (JSON.stringify(str.match(/.*(?=T)/g))).replace(/[^\d-]+/g,"");
}
console.log(get_date())