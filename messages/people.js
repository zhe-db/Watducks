/**
 * Created by tonyz on 1/23/2017.
 */

var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
var str="";
var name;
function getGlo(uwid) {
    if (name == null) {
      //  console.log('get info from api')
        get_info(uwid).then(function(data){
            name = data.data.full_name;
            return name;
           // console.log(name);
        })
    } else {
    }
}

function get_info (uwid) {
    var p1 = new Promise(
        function (resolve, reject) {
            uwclient.get("/directory/" + uwid,
                function (err, res) {
                    if (!err) {
                        resolve(res)
                    }
                    else {
                        reject(res.meta.message);
                    }
                })
        }
    );
    return p1;
}
 //get_info('r49tang');

setTimeout(function()
{getGlo("z687wang");
    },500);
setTimeout(function(){
    console.log(name);
},1000);
