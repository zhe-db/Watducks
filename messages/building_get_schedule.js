/**
 * Created by WangZheZen on 2/9/2017.
 */
var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function direct (instructions){
    var code = encodeURIComponent(instructions);

    var options = {
        url : 'https://westus.api.cognitive.microsoft.com/luis' +
        '/v2.0/apps/ae60bd7a-97ad-4dd3-925d-44b2db7fcd17?subscription-key=7a78a990591f446e8c594' +
        '3fe0cd73a76&q='+code+'&timezoneOffset=0.0&verbose=true',
        headers: {
            //   'User-Agent': 'request'
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            //  console.log(info.topScoringIntent.intent)
            // console.log(info)
            decide(info.topScoringIntent.intent,info.entities);
            //.intents[0].actions[0].parameters[0].value[0].entity
        }

    }
    request(options, callback);
}
function decide (str, entity){
    //  console.log(str)
    switch(str) {
        // case "check_course":
        //     //  console.log('gg')
        //     check_course(entity);
        //     break;
        // case "vending machines":
        //     vending_machine_(entity);
        //     break;
        // // case "get class room schedule":
        // //     room_schedule(entity);
        // //     break;
        // case "check_available_seats":
        //     check_seats(entity);
        //     break;
        case "get class room schedule":
            check_schedule(entity);
            break;
    }
}
function check_schedule (entity) {
    for (var i=0;i<entity.length;i++){
        switch  (entity[i].type){
            case "id":
                var  id = entity[i].entity;
                //  console.log(number);
                break;
            case "string":
                var building= entity[i].entity;
                //   console.log(code);
                break;
        }}

    get_schedule(building,id,"08:30","F");
}
function get_schedule(building,room,time,week){

            uwclient.get('/buildings/'+building+'/'+room+'/courses',function (err,res) {
                if (!err){
                    check_room(res,time,week)
                }
            })
        }
function check_room (res,time,week_days){
    var list =res.data;
    if (!list){
        return "Wrong room number";
    }
    else {
        var arr=[];
        for (var i=0;i<list.length-1;i++){
            if (list[i].start_time>time||list[i].end_time>time){
                if (week_days.toUpperCase()=="T"){
                    if ((list[i].weekdays.indexOf("T")!= -1 &&
                        list[i].weekdays.indexOf("Th")==-1)||(list[i].weekdays.indexOf("T")!= -1 && list[i].weekdays.indexOf("TTh")!=-1)){
                        var data=list[i];
                        arr.push(data.subject +data.catalog_number+" "+data.section+" "+data.start_time+"-"+data.end_time)
                    }
                }
                else{
                    if(list[i].weekdays.indexOf(week_days)!= -1)
                    {    var data=list[i];
                        arr.push(data.subject +data.catalog_number+" "+data.section+" "+data.start_time+"-"+data.end_time)
                    }}}
        }
        console.log( quicksort(arr))
    }
}

function swap (list,first,second){
    var temp = list[first];
    list[first]=list[second];
    list[second] = temp;
}
function partition  (list,left,right){
    var pivot = list[Math.floor((right+left)/2)];
    var i =left;
    var j = right;
    while(i<j){
        while(get_index(list[i]) < get_index(pivot)){
            i++
        }
        while(get_index(list[j])>get_index(pivot)){
            j--;
        }
        if (i<=j){
            swap(list,i,j);
            i++;
            j--;
        }
    }
    return i;
}
function get_index(item){
    var re_1= /(\d+:)/g;
    var res= item.match(re_1)[0].slice(0,2);
    return res;
}
function quicksort(list,left,right){
    var index;
    if (list.length> 1){
        left = typeof left!="number"? 0 : left;
        right = typeof right!="number"? list.length-1 : right;
        index = partition(list,left,right);
        if (left<index - 1){
            quicksort(list,left,index-1);
        }
        if (index<right){
            quicksort(list,index,right);
        }}
    return list;}
//get_schedule("DC",1350,"08:00","M");
direct("DC 1350");