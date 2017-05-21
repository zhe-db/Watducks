/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var onoff =false;
var request = require('request');
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var uwaterlooApi = require('uwaterloo-api'); 
var useEmulator = (process.env.NODE_ENV == 'development');
var termcode = 1175;
var luisAppId = 'ae60bd7a-97ad-4dd3-925d-44b2db7fcd17';
var luisAPIKey = '7a78a990591f446e8c5943fe0cd73a76'; 
//process.env.LuisAPIKey;
var luisAPIHostName = 'westus.api.cognitive.microsoft.com/' || 'api.projectoxford.ai';

const LuisModelUrl ='https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;
// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
//bot.dialog('/', intents);
// 743887d93f1df944a7acae0f78741746.
var uwclient = new uwaterlooApi({
  API_KEY : '743887d93f1df944a7acae0f78741746'
});
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
   function (session){
    if (session.userData.name==""||!session.userData.name){
        session.beginDialog('/profile');
    }
    else {
        session.beginDialog('/direction');
    }
//  session.endDialog();
   }])
    //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 

bot.dialog('/direction',[
     function (session){ 
        greeting_start(session,session.userData.name);
        get_weather(session);
    //    info_session(session);
      // builder.Prompts.text(session,"Hi, " + session.userData.name+". "+fnTime());
   // next();
     },
    //  function(session){
    // builder.Prompts.choice(session, "What language do you code using?", ["JavaScript", "C", "Ruby"]);
    //  },
    function (session, results) {
        // session.userData.language = results.response.entity;
        // session.send("Got it... "  + 
        //             " you've been programming with  " + session.userData.language + ".");
         builder.Prompts.choice(session,"Do you want to clear your profile?", ["YES", "NO"]);
    },
    function (session,results){
        session.userData.clear=results.response.entity;
        if (session.userData.clear=="YES"){
            session.beginDialog('/clear');
        }
        else{
            session.send("Okay")
            
        }
     
      
     session.endDialog();
           session.beginDialog('/directions');
    }
    ])
   
bot.dialog('/clear', [
    function (session){
        session.userData.name="";
        session.send("Clear Successful!")
         session.endDialog();
    }
    ])

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your UWid (I like that!) or name?');
    },
    function (session, results) {
        session.userData.name = results.response.toUpperCase();
      //  if (session.userData.name.match[/[\d]/g]!==-1)
     //   {
     //       session.userData.name=get_profile(results.response);
     //   }
        
          session.beginDialog('/directions');   
           // session.endDialog();
    }
]);

bot.dialog("/directions",[
    function(session){
         builder.Prompts.text(session,"What do you want to know?");
    },
    function (session,results) {
         var key = results.response;
         direct(session,key);
    },function(session){
         builder.Prompts.choice(session,"Do you want to ask another question?", ["YES", "NO"]);
    },function(session, results){
         session.userData.clear=results.response.entity;
        if (session.userData.clear=="YES"){
            session.beginDialog('/directions');
        }
        else{
            session.send("Then, Bye~")
            session.endDialog();
        }
    }
   
    ]);

bot.dialog('/directions_1',[
    function(session){
        //   builder.Prompts.choice(session,"Do you want to ask another question?", ["YES", "NO"]);
        session.send('Do you want to ask another question?')
    },
    function (session,results){
        session.userData.dir=results.response.entity;
        if (session.userData.dir=="YES"){
            session.beginDialog('/directions');
        }
        else{
            session.send("Okay. Bye, "+session.userData.name);
           // session.endDialog();
            //session.beginDialog('/direction');
            session.endDialog();
        }
    }     
    ])

//--------
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

// get user's course infomation
function getcourse (str){
    var re1=/([A-Z])\w+/g;
    return str.match(re1);
};
function getcourse_id (str){
    var reid=/\d+\w?/g;
    return str.match(reid);
};
 

// uw-api temp_cv
// filter importation info that required

function temp_c (str){
	var re1=/temperature_current_c.*?h/g;
	var re2=/[^\d.]+/g;
	return 	(JSON.stringify(str.match(re1))).replace(re2,"");
	};
	
// main function that gets weather info from UW-api

function get_weather (session){
	(uwclient.get('/weather/current', function(err, res) {
builder.Prompts.text(session,"Current temperature: "+(temp_c(JSON.stringify(res)))+"°C  Wind speed: "+(wind_c(JSON.stringify(res)))+"Km/h")
}))
}

// get current wind speed
//---------------------------------------------------------------------------------------------------------------
function  wind_c (str){
    var re1=/wind_speed.*?,/g;
    var re2=/[^\d.]+/g;
    return (JSON.stringify(str.match(re1))).replace(re2,"");
};
//-----------------------------------------------------------------------------------------------------------------
// get info_session
function info_session (session) {

    (uwclient.get('/terms/'+termcode+'/infosessions', function (err, res) {
       if ((get_session('MATH - Computer Science',fnTimeDate(),res.data))=='[]'){
           session.send("It appears that there is no info session suits you today...")
       }
       else {
           session.send(get_session('MATH - Computer Science',fnTimeDate(),res.data))
       }
    }))
}
function get_session (major,date,list) {
    var session_arr=[];
    for (var i=0;i<list.length;i++){
        if(date==list[i].date && targeted(major,list[i].audience)){
            session_arr.push("employer: " + list[i].employer + " Time: "+list[i].start_time+"-" + list[i].end_time +
                " Location: "+list[i].building.code+" "+list[i].building.room);
        }
    }
    return JSON.stringify(session_arr);
}

function targeted(magjor,list ) {
    for (var i=0;i<list.length;i++){
        if (magjor==list[i]){
            return true;
        }
        if (i==list.length-1) {
            return false;
        }
    }
}
//------------------------------------------------------------
// get current time 
function fnTimeDate(){
var myTime=new Date()
var iYear=FixSecond(myTime.getFullYear())
var iMonth=FixSecond(myTime.getMonth()+1)
var iWeek=FixSecond(myTime.getDay())
var iDate=FixSecond(myTime.getDate())
var iHour=FixSecond(myTime.getHours())
			var iMinute=FixSecond(myTime.getMinutes())
			var iSecond=FixSecond(myTime.getSeconds())
			function FixSecond(num){
			return num<10? "0"+num : num;}
return iYear+"-"+iMonth+"-"+iDate}

function fn_hour_minute(){
var myTime=new Date()
var iYear=FixSecond(myTime.getFullYear())
var iMonth=FixSecond(myTime.getMonth()+1)
var iWeek=FixSecond(myTime.getDay())
var iDate=FixSecond(myTime.getDate())
var iHour=FixSecond(myTime.getHours())
			var iMinute=FixSecond(myTime.getMinutes())
			var iSecond=FixSecond(myTime.getSeconds())
			function FixSecond(num){
			return num<10? "0"+num : num;}
return iHour+":"+iMinute}
function fn_weekday(){
var myTime=new Date()
var iYear=FixSecond(myTime.getFullYear())
var iMonth=FixSecond(myTime.getMonth()+1)
var iWeek=FixSecond(myTime.getDay())
var iDate=FixSecond(myTime.getDate())
var iHour=FixSecond(myTime.getHours())
			var iMinute=FixSecond(myTime.getMinutes())
			var iSecond=FixSecond(myTime.getSeconds())
			function FixSecond(num){
			return num<10? "0"+num : num;}
return iWeek;}
// get current time
	function fnTime(){
var myTime=new Date()

var iYear=FixSecond(myTime.getFullYear())
var iMonth=FixSecond(myTime.getMonth()+1)
var iWeek=FixSecond(myTime.getDay())
var iDate=FixSecond(myTime.getDate())
var iHour=FixSecond(myTime.getHours())
			var iMinute=FixSecond(myTime.getMinutes())
			var iSecond=FixSecond(myTime.getSeconds())
			function FixSecond(num){
			return num<10? "0"+num : num;}
return iYear+"-"+iMonth+"-"+iDate+" "+iHour+":"+iMinute+":"+iSecond;}

function fnclock(){
    var myTime=new Date()
    var iHour=FixSecond(myTime.getHours())
	
	function FixSecond(num){
		return num<10? "0"+num : num;}
    return parseInt(iHour);}

//-----------------------------------------------------------------
// get_user_profile and greeting 
function get_info_greeting(session,uwid) {
            (uwclient.get("/directory/" + uwid,
            function(err, res) {
        greeting(session,res.data);
}))}

function greeting(session,got) {
    var time = fnclock();
    var name = got.given_name;
    if (time >= 0 && time <= 10) {
       session.send("Good Morning, " + name +" " + fnTime())
    }
    if (time > 10 && time <= 18) {
       session.send("Good Afternoon, "+name+" "+ fnTime())
    }
    if (time>18 && time<24) {
        session.send("Good Evening, " +name+" "+fnTime())
    }
}

function determine_name (session,name) {
  
    var re_1 = /\d+/g;
    //name.match(re_1)
    //
    if (name.search(re_1)!=-1) {
      //  session.send(name);
        get_info_greeting(session,name);
    }
    else {
    //   session.send(11111);
        greeting_name(session,name);
    }
}

function greeting_name(session,name) {
      var time = fnclock();
   // session.send(time)
  // session.send(name)
   if (time >= 0 && time <= 10) {
       session.send("Good Morning, " + name +" , " + fnTime())
    }
    if (time > 10 && time <= 18) {
       session.send("Good Afternoon, "+name+" , "+ fnTime())
    }
    if (time>18 && time<24) {
        session.send("Good Evening, " +name+" , "+fnTime())
    }
}

function greeting_start (session,data){
 determine_name(session,data);
}

//------------------------------------------------------------------------------------
// direction
function direct (session,instructions) {
    var code = encodeURIComponent(instructions)
    var session = session;
    var options = {
        url: 'https://westus.api.cognitive.microsoft.com/luis' +
        '/v2.0/apps/ae60bd7a-97ad-4dd3-925d-44b2db7fcd17?subscription-key=7a78a990591f446e8c594' +
        '3fe0cd73a76&q=' + code + '&timezoneOffset=0.0&verbose=true',
        headers: {
            //   'User-Agent': 'request'
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            //  console.log(info.topScoringIntent.intent)
            // console.log(info)
            decide(info.topScoringIntent.intent, info.entities,session);
            //.intents[0].actions[0].parameters[0].value[0].entity
        }

    }   

    request(options, callback);
}

function decide(str, entity,session) {
    //  console.log(str)
    switch (str) {
        case "info_session":
            info_session(session);
            break;
        case "check_course":
            //  console.log('gg')
            check_course(session,entity);
            break;
        case "vending machines":
            vending_machine_(session,entity);
            // session.send('entity')
            // console.log('vending');
            break;
        case "goose":
         //   console.log('gg')
            interesting_reports(session);
            break;
        case "get class room schedule":
             check_schedule(session,entity);
            break;
        case "greeting":
            greeting_1(session);
            break;
        case "check_available_seats":
           search_seats(session,entity);
           break;
        case "Age":
            age_1(session);
            break;
        case "Hobby":
            hoby_1(session);
            break;
        case "exam_schedule":
            check_exam(session,entity);
            break;
        case "bye":
            bye(session);
            break;
        case "whoami":
            intro(sesson);
            break;
        case "codeability":
            codeability(session);
            break;
        case "coop_goal":
            coop_goal(session);
            break;
        case "projects":
            my_projects(session);
            break;
        case "experienc":
            my_experience(session);
            break;
        
    }
}
function intro(session){
    
    
};
function check_course(session,entity) {
    for (var i = 0; i < entity.length; i++) {
        switch (entity[i].type) {
            case "course_number":
                var number = entity[i].entity;
                //  console.log(number);
                break;
            case "course_code":
                var code = entity[i].entity;
                //   console.log(code);
                break;

        }
    }
    session.send("I found "+code.toUpperCase()+" "+number+" for you.");
    course_info(session,code, number);
  //  console.log(code, number);
}

function course_info(session,course_code, course_number) {
    (uwclient.get("/courses/" + course_code + "/" + course_number, function (err, res) {
        //   console.log(res);
        session.send( res.data.title );//+ " description: " + res.data.description);
        session.send("prerequisites: " + res.data.prerequisites+" antirequistes: " + res.data.antirequisites);
        session.send( res.data.url);

    }))
}

function vending_machine_(session,entity) {
   // session.send('11')
    // console.log('gg')
    for (var i = 0; i < entity.length; i++) {
        switch (entity[i].type) {
            case "string":
                var building = entity[i].entity.toUpperCase();
                //  console.log(number);
                break;
            case "builtin.ordinal":
                var floor = entity[i].entity.charAt(0);
                //   console.log(code);
                break;

        }
    }
    // console.log('vending')
    vending(session,building, floor);
}

function vending(session,building, floor) {
    // console.log(building,floor);
    // console.log(building);
    // session.send(floor)
    var session = session;
        (uwclient.get('/buildings/' + building + '/vendingmachines', function (err, res) {
            if (!err) {
                if (res.data.vending_machines) {
                get_machines(session,res.data.vending_machines, floor);
            }
            else {
                session.send('Ooops, It seems that there is no vending machine nearby. TAT');
            }
            // console.log('res')
        }
                
            else {
                reject(res.meta.message);
            }}
        ))
    ;
}

function get_machines(session,res, floor) {
    var list = [];
    var num = floor.charAt(0);
    for (var i = 0; i < res.length; i++) {
        var str;
        if (i == num) {
            str = "I found " + res[i].location + " vending machine, it has " + (res[i].products.join(', ') + ". :-)");
            list.push(str)
        }
        // break;

    }

    if (list.length == 0) {
        //  console.log('gg')
        str = res[0].location + " vending machine, it has " + (res[0].products.join(', '));
        list.push(str)
        session.send('It seems that there is no vending machine on ' + num + "F" + ", I got you " + list.join('\n') + ". =.=")
        //   console.log(list.length);
    }
    // if (list==[]){
    //     console.log('It seems that there is no vending machine nearby. TAT')
    // }
    else {
        session.send(list.join(' '));
    }
}

function interesting_reports(session) {
///resources/goosewatch
            (uwclient.get("/resources/goosewatch",
                function (err, res) {
                    if (!err) {
                         get_news(session,res.data);
                    }
                    else {
                        reject(res.meta.message);
                    }
                }))
        };

function get_news(session,json) {
    var m = Math.floor(Math.random() * 41);
    var arr = [];
    //   console.log(json.length);
    for (var i = 0; i < json.length; i++) {
        if (i == m) session.send("interesting reports: " + "{ " + "Location: " + json[i].location + " updated time: " + json[i].updated + " }");
        //   arr.push();//.location +" "+json[i].updated);
    }
    //  console.log(arr);
}

function search_seats (session,entity) {
    // console.log('gg')
    for (var i = 0; i < entity.length; i++) {
        switch (entity[i].type) {
            case "course_number":
                var course_num = entity[i].entity;
                break;
            case "section_number":
                var section = entity[i].entity;
                break;
            case "course_code":
                var course_code = entity[i].entity;

        }
    }
   // session.send(course_code+course_num+section);
   search_course_section(session,course_code, course_num,section);
}

function search_course_section(session,subject,course_number,section_number)
   {    
       (uwclient.get('/courses/'+subject+'/'+course_number+'/schedule', function (err, res) {
        if (!err) {
            search_section(session,section_number,res.data);
         //   console.log("LEC 0" + section_number);
        } else {
            reject(res.meta.message);
        }
    }));}

function search_section (session,section_number,res){
    //console.log("LEC 0" + section_number);
    for (var i =0;i<res.length;i++) {
        if(section_number<10){
           // session.send(res[i].section)
        if ("LEC 0" + section_number == res[i].section) {
            var num =res[i].enrollment_capacity-res[i].enrollment_total;
              //  console.log(res[i])
            //   session.send("LEC 0" + section_number);
                session.send(res[i].subject+res[i].catalog_number+" "+res[i].section);
                session.send("Available seats: " + num);
                session.send("It starts from " + res[i].classes[0].date.start_time+" to "+res[i].classes[0].date.end_time
                +" in "+res[i].classes[0].location.building+" "+res[i].classes[0].location.room)
        }
    }
    else{if ("LEC 0" + section_number == res[i].section) {
            var num =res[i].enrollment_capacity-res[i].enrollment_total;
            //  console.log(res[i])
            session.send(res[i].subject+res[i].catalog_number+" "+res[i].section);
            session.send("Available seats: " + num);
            session.send("It starts from " + res[i].classes[0].date.start_time+" to "+res[i].classes[0].date.end_time
                +" in "+res[i].classes[0].location.building+" "+res[i].classes[0].location.room)}
}}}

function greeting_1(session){
    session.send(['Hi','Hello','Yo','how is it going?','how are you recently?','Everything all right?','Whats up?'])
    
}
function bye (session){
    session.send("Bye~");
    session.endDialog();
}
function age_1(session){
    session.send(['Oops, I am 18 year old, forever.',
    'I dont actually know my age because it must be a large number, larger than the age of Ha, HaHa , now one second.',
    'Well, hard to say, maybe one second？','I tell everybody I am 18 years old, however, I am actually infinite one second.'])
}

function hoby_1(session){
    session.send(['I like watching football, i.e Manchester City'
    ,'Well, Football, I think.',
    'Football and Film',
    'I love StarCrat II, You know what? I am the king of Zerg in Waterloo(NA Server).',
    'StarCraft II and FFXV.'])
}

//------------------get class room schedule-------------------
function check_schedule (session,entity) {
    for (var i=0;i<entity.length;i++){
        switch  (entity[i].type){
            case "id":
                var  id = entity[i].entity;
                //  console.log(number);
                break;
            case "number":
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
   session.send("I got you "+building.toUpperCase()+id+" schedule after "+fn_hour_minute());
    get_schedule(session,building,id,fn_hour_minute(),convert_time(session,new Date().getDay()));
}

function get_schedule(session,building,room,time,week){

            uwclient.get('/buildings/'+building+'/'+room+'/courses',function (err,res) {
                if (!err){
                    check_room(session,res,time,week)
                }
            })
        }
        
function check_room (session,res,time,week_days){
    var list =res.data;
    var sessions = session;
    if (!list){
        session.send("Invalid room number~");
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
        session.send(quicksort(arr).join('<br>'));
        if(arr.length == 0){
            session.send('It seems that this classroom is available till end of the day!')
        }
    }
}

function convert_time (session, weekday){
    switch (weekday){
        case 0:
            session.send('Weekends no lectures!');
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
             session.send('Weekends no lectures!');
            break;
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
//--------------------------------------------------------------
//--------------------------------------------------------------
function check_exam (session,entity) {
   // session.send('11')
    // console.log('gg')
    for (var i = 0; i < entity.length; i++) {
        switch (entity[i].type) {
            case "course_code":
                var subject =entity[i].entity;
                break;
            case "course_number":
                var number = entity[i].entity;
                break;

        }
    }
    // console.log('vending')
    exam_schedule (session,subject,number);
}

function exam_schedule (session,subject,course_number)
{
    uwclient.get('/courses/' + subject + "/" + course_number + '/examschedule', function (err, res) {
        if (!err) {
            session.send("Here is " + subject.toUpperCase() + course_number+" final schedule:");
            session.send(res.data.sections[0].start_time + " - "
                + res.data.sections[0].end_time + " " + res.data.sections[0].day +
                " " + res.data.sections[1].date + "<br>" + res.data.sections[0].location);
          //  console.log(res.data)
        }
    });
}