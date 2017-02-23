/**
 * Created by WangZheZen on 1/27/2017.
 */
var async = require('async');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
var str;
function get_info (uwid) {
    var p1 = new Promise(
        function (resolve, reject) {
            uwclient.get("/directory/" + uwid,
                function (err, res) {
                    if (res) {
                        resolve(res)
                    }
                })
        }
    );

p1.then(function resolve (res){
    str = res.data;
   // console.log(str);
    return str;
    if (str==null){
        resolve(res);
    }
    else{
        console.log(str)
    }
},function reject (err) {
    console.log(err);
});}
console.log(get_info("z687wang"));

//console.log(str);