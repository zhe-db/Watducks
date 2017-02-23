/**
 * Created by WangZheZen on 2/2/2017.
 */
var request = require('request');

var options = {
    url: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ae60bd7a-97ad-4dd3-925d-44b2db7fcd17?subscription-key=7a78a990591f446e8c5943fe0cd73a76&q=CS135&timezoneOffset=0.0&verbose=true' ,
    headers: {
       'Content-Type' : 'application/json'
      //  'Cache-Control':'no-cache',
    //    'Ocp-Apim-Subscription-Key': '729190a30339427ba16407ddc14d7932'
       // 'Host':'https://westus.api.cognitive.microsoft.com/qnmaker/v1.0',
       // 'question':'hi'
    }

};


request.get(options, function optionalCallback(err, httpResponse, body) {
    if (err) {
        return console.error(err);

    }
    console.log(httpResponse);

});