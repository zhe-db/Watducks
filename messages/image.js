/**
 * Created by WangZheZen on 2/13/2017.
 */
var request = require('request');

var options ={
  url :"https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/999bb885-631f-4163-9d19-a4503574d585/generateAnswer",
  method:'POST',
    headers:{
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "729190a30339427ba16407ddc14d7932",
        "Cache-Control": "no-cache"
      //  "data":"https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr?"
    },
    body: JSON.stringify({"question": "Hi"})
};
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
       console.log(body);
    }
    else {
        console.log('error');
        console.log(response);
    }
}

request(options, callback);
