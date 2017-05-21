/**
 * Created by WangZhe on 2/9/2017.
 */

var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});

// This is a module testing LIUS identification working with bot

// Send a request to LUIS to identify instructions returning a list of intents which are sorted by scoring

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
// A simple decide test
function decide (str, entity){
    switch(str) {
        case "check_course":
            check_course(entity);
            break;
        case "vending machines":
            vending_machine_(entity);
            break;
        case "check_available_seats":
            check_seats(entity);
            break;
        case "get class room schedule":
            check_schedule(entity);
            break;
    }
}
