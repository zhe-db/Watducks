/**
 * Created by WangZheZen on 2/3/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
var p1=new Promise( function (resolve,reject) {
    uwclient.get('/courses/CS/136/schedule', function (err, res) {
        if (!err) {
            resolve(res)
        } else {
            reject(res.meta.message);
        }
    })
});

p1.then (function (res){
    // console.log(res.data[0].classes)
      search_section(2,res.data);
    },
    function (err){
    console.log(err)
    }
);
function search_section (section_number,res){
//    console.log("LEC 00"+section_number);
    for (var i =0;i<res.length;i++) {
        var i = i;
        if ("LEC 00" + section_number == res[i].section) {
            var i = i;
            var num =res[i].enrollment_capacity-res[i].enrollment_total;
              //  console.log(res[i])
                console.log("Available seats: " + num)
                console.log("It starts from " + res[i].classes[0].date.start_time+" to "+res[i].classes[0].date.end_time
                +" in "+res[i].classes[0].location.building+" "+res[i].classes[0].location.room)
        }
    }
}