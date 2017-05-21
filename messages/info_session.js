/**
 * Created by tonyz on 1/21/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
// Module for retrieving data of info sessions from UW Open Data API
exports.info_session = function info_session (major, date) {
    (uwclient.get('/terms/1171/infosessions', function (err, res) {
        console.log(get_session(major, date, res.data));
    }))
};
function get_session (major, date, list) {
    var session_arr = [];
    for (var i = 0; i < list.length; i++){
        if(date == list[i].date && targeted(major, list[i].audience)){
            session_arr.push("employer: " + list[i].employer + " Time: " + list[i].start_time + "-" + list[i].end_time +
                " Location: " + list[i].building.code + " " + list[i].building.room);
        }
    }
    return JSON.stringify( session_arr);
}
function targeted(magjor, list ) {
    for (var i = 0; i < list.length; i++){
        if (magjor == list[i]){
            return true;
        }
        if (i == list.length-1) {
            return false;
        }
    }
}
//info_session('MATH - Computer Science',"2017-01-04")
