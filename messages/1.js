/**
 * Created by WangZheZen on 1/23/2017.
 */
var uwaterlooApi = require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746'
});

var a;
//Use the API
var p1 = new Promise(function(resolve, reject){
    uwclient.get('/foodservices/menu', function(err, res) {
        if (!err) {
             resolve({
                data:res,
                msg:"hi"


            });q
        } else {
            reject(err);
        }
    });
});

p1.then(function(obj){  console.log( obj.data) }, function(err){
});
