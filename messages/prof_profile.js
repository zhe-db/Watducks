/**
 * Created by WangZheZen on 2/20/2017.
 */
var request =require("request");
var request = require('request');
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function extract_info(array){
        var options = {

            url: "http://www.adm.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl?level=under&sess=1171&subject=CS&cournum=136",
            method: "GET"

        };

        function callback(error, response, body) {
            var re_1 =/\<TR\>.*\<\/TR\>/g;
            var list_1 =body.match(re_1);
            var arr=[];
            var re_3=/........................................$/g;
            var re_2=/\<\/TD\>\<\/TR\>/g;
            var replace_6=/\s+/g;
            for (var i=0;i<list_1.length;i++){
                if(list_1[i].indexOf("LEC")!=-1){
                    var num = list_1[i].match(/LEC \d\d\d/g)[0];
                    var text_1 =list_1[i].match(re_3)[0];
                    var text_2 =text_1.replace(re_2,"");
                    var name=text_2.replace(replace_6,"");
                    arr.push(num+" "+name);
                }
            }
           // console.log(list_1);
            console.log(arr);
        }

        request(options, callback);}
        extract_info(1);