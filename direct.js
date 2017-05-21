var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
// A testing module testing version 1.0.2 bots connection to LUIS

function direct (instructions){
    var code = encodeURIComponent(instructions);
    var options = {
        url : 'https://westus.api.cognitive.microsoft.com/luis' +
        '/v2.0/apps/ae60bd7a-97ad-4dd3-925d-44b2db7fcd17?subscription-key=7a78a990591f446e8c594' +
        '3fe0cd73a76&q='+code+'&timezoneOffset=0.0&verbose=true'
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            decide(info.topScoringIntent.intent, info.entities);
        }
    }
    request(options, callback);
}
function decide (str, entity){
    //  console.log(str)
    switch(str) {
        case "check_course":
            //  console.log('gg')
            check_course(entity);
            break;
        case "vending machines":

            vending_machine_(entity);
            break;
        case "get class room schedule":
            check_room(entity);
            break;
        case "check_available_seats":
            check_seats(entity);
    }
}
function check_course (entity){
    for (var i = 0; i < entity.length; i++){
        switch (entity[i].type){
            case "course_number":
                var  number = entity[i].entity;
                //  console.log(number);
                break;
            case "course_code":
                var code = entity[i].entity;
                //   console.log(code);
                break;

        }
    }
    course_info(code,number);
    console.log(code,number);
}

function course_info (course_code,course_number) {
    (uwclient.get("/courses/" + course_code + "/" + course_number, function (err,res) {
        //   console.log(res);
        console.log("title: "+res.data.title);
        console.log("description: "+res.data.description);
        console.log("prerequisites: "+res.data.prerequisites);
        console.log("antirequistes: "+res.data.antirequisites);
        console.log("url: "+res.data.url);

    }))
}

//direct("DC 1st floor");
function vending_machine (entity){
    console.log('gg');
    for (var i = 0; i < entity.length; i++){
        switch  (entity[i].type){
            case "string":
                var  building = entity[i].entity.toUpperCase();
                //  console.log(number);
                break;
            case "builtin.ordinal":
                var floor = entity[i].entity.charAt(0);
                //   console.log(code);
                break;

        }
    }
    vending(building,floor);
}
function vending (building,floor) {
    // console.log(building,floor);
    var p1= new Promise(function (resolve, reject){
        uwclient.get('/buildings/' + building + '/vendingmachines', function (err, res) {
            if (!err) {
                resolve(res)
            } else {
                reject(res.meta.message);
            }
        })
    });
    p1.then(function (res){
            get_machines(res.data.vending_machines);
        },
        function (err){
            console.log(err);
        }
    );
}
// Get current info of a vending machine

function get_machines(res){
    var list=[];
    for (var i = 0; i < res.length; i++){
        var str;
        str = res[i].location + " vending machine products: " + (res[i].products.join(', '));
        list.push(str)
    }
    //console.log('gg');
    console.log(list.join('\n'));

}
function check_schedule (entity){
    for (var i = 0; i < entity.length; i++){
        switch  (entity[i].type){
            case "id":
                var  id = entity[i].entity;
                //  console.log(number);
                break;
            case "builtin.number":
                var  id = entity[i].entity;
                //  console.log(number);
                break;
            case "string":
                var building= entity[i].entity;
                //   console.log(code);
                break;
        }}
    //  session.send(convert_time(fn_weekday()));  //new Date().getDay()
    console.log("I got you " + building.toUpperCase() + id + " schedule after " + fn_hour_minute());
    get_schedule(building, id , fn_hour_minute(), convert_time(new Date().getDay()));
}
//get_schedule("DC", "1350" , "10:30", "T");

function get_schedule(building, room, time, week){
    uwclient.get('/buildings/' + building + '/' + room + '/courses',function (err, res) {
        if (!err){
            check_room(res, time, week)
        }
    })
}

function check_room (res, time, week_days){
    var list = res.data;
    if (!list){
        console.log("Wrong room number");
    }
    else {
        var arr = [];
        for (var i = 0; i < list.length - 1; i++){
            if (list[i].start_time > time || list[i].end_time > time){
                if (week_days.toUpperCase() == "T"){
                    if ((list[i].weekdays.indexOf("T") != -1 &&
                        list[i].weekdays.indexOf("Th") == -1) ||
                        (list[i].weekdays.indexOf("T") != -1 &&
                        list[i].weekdays.indexOf("TTh") != -1)){
                        var data = list[i];
                        arr.push(data.subject + data.catalog_number + " " + data.section + " " + data.start_time + "-" + data.end_time)
                    }
                }
                else{
                    if(list[i].weekdays.indexOf(week_days) != -1)
                    {    var data = list[i];
                        arr.push(data.subject + data.catalog_number + " " + data.section + " " + data.start_time + "-" + data.end_time)
                    }}}
        }
        console.log(quicksort(arr).join('<br>'));
    }
}

function convert_time (weekday){
    switch (weekday){
        case 0:
            console.log('Weekends no lectures!');
            break;
        case 1:
            return "M";
            break;
        case 2:
            return "T";
            break;
        case 3:
            return "W";
            break;
        case 4:
            return "Th";
            break;
        case 5:
            return "F";
            break;
        case 6:
            console.log('Weekends no lectures!');
            break;
    }
}

function swap (list, first, second){
    var temp = list[first];
    list[first] = list[second];
    list[second] = temp;
}

function partition  (list, left, right){
    var pivot = list [Math.floor((right + left) / 2)];
    var i = left;
    var j = right;
    while(i < j){
        while(get_index(list[i]) < get_index(pivot)){
            i++;
        }
        while(get_index(list[j]) > get_index(pivot)){
            j--;
        }
        if (i <= j){
            swap(list, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function get_index(item){
    var re_1= /(\d+:)/g;
    var res= item.match(re_1)[0].slice(0, 2);
    return res;
}

function quicksort(list, left, right){
    var index;
    if (list.length > 1){
        left = typeof left != "number"? 0 : left;
        right = typeof right != "number"? list.length-1 : right;
        index = partition(list, left, right);
        if (left < index - 1){
            quicksort(list, left, index-1);
        }
        if (index < right){
            quicksort(list, index, right);
        }
    }
    return list;
}

/**
 * Created by WangZhe on 2/4/2017.
 */
// Test:
// direct("DC 1350 schedule");