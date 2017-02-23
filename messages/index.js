/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var uwaterlooApi = require('uwaterloo-api'); 
var useEmulator = (process.env.NODE_ENV == 'development');
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
bot.dialog('/',[
    function (session){
        if (session.userData.name==""){
            dialog.begin
        }
    }
    
    
    ],
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },21
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
    //    get_weather(session);
        current_term_code(session);
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }
]);


//bot.dialog('/getclass',[
//    function (session) {
//        builder.Prompts.text(session,"Can you tell me what classes you have this term? CS-XXX;MATH-XXX,etc");}
//        function (session, results){
//            session.couresinfo=results.response;
//            session.uesrdata.arr_name=getcourse(result.response);
//            session.arr_id=getcourse_id(result.response);
//        }
//    ])



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
 

// uw=api temp_cv
// filter importation info that required
function temp_c (str){
	var re1=/temperature_current_c.*?h/g;
	var re2=/[^\d.]+/g;
	return 	(JSON.stringify(str.match(re1))).replace(re2,"");
	};
// main function that gets weather info from UW-api
function get_weather (session){
	(uwclient.get('/weather/current', function(err, res) {
session.send("Current temperature:"+(temp_c(JSON.stringify(res)))+"°C  Wind speed:"+(wind_c(JSON.stringify(res)))+"Km/h")
}))
}
function  wind_c (str){
    var re1=/wind_speed.*?,/g;
    var re2=/[^\d.]+/g;
    return (JSON.stringify(str.match(re1))).replace(re2,"");
};
function current_term(str){
    var re_term =/("title".*?\)){1}/g;
    var re_code=/[^\d+]/g;
    return JSON.stringify(str.match(re_term)).replace(re_code,"");
}
function current_term_code (session){
    (uwclient.get('/terms/list',function (err,res){
        session.send (current_term(JSON.stringify(res)));
    }))
}
