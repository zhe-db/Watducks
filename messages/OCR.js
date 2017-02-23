/**
 * Created by WangZheZen on 2/18/2017.
 */
var request =require("request");
var options ={
  url:"https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr",
    method:"POST",
    headers:{"Ocp-Apim-Subscription-Key":"b004442cd8e94cefb7e5747087f3f9b3"},
    body:JSON.stringify({
        "url":"http://i.imgur.com/pnO2iBT.jpg"

    })
};
function callback(error, response, body) {
    // var re_1=/image" content=".*/g;
    // var re_2=/http.*?.jpg/g;
    if (!error && response.statusCode == 200) {
        // var text_1 = body.match(re_1).join("");
        // var text_2 = text_1.match(re_2);11
        // var text_3=text_2.match(re_3).join("");
        console.log(body);
    }
    else {
        console.log(body);
        console.log(response);
    }
}


request(options, callback);