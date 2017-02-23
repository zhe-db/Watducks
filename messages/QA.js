var jsdom = require("jsdom");
var $ = require('jquery')(jsdom.jsdom().defaultView);



$(function() {
    var params = {
        // Request parameters
        "query": "velocity",
        "complete": "",
        "count": "",
        "offset": "",
        "timeout": "",
        "model": ""
    };

    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/academic/v1.0/interpret?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","7bb83f7782c64a8ba10aa92ec54b928d");
        },
        type: "GET",
        // Request body
        data: "{body}"
    })
        .done(function(data) {
            console.log("success");
        })
        .fail(function(data) {
            console.log(data);
        });
});


var request = require('request');

var url = 'https://westus.api.cognitive.microsoft.com/academic/v1.0/interpret?';


request.post(
    'http://www.yoursite.com/formpage',
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);