/**
 * Created by WangZheZen on 2/20/2017.
 */
// key :bdb4c54829f6451785d8a65da26aad90
var request =require("request");
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function create_face_list (name) {

var options ={
  url:"https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+name,
    headers:{
      "Ocp-Apim-Subscription-Key":"bdb4c54829f6451785d8a65da26aad90"
    },
    method:"PUT",
    body: JSON.stringify({
        "name":"uwaterloo001",
        "userData":"Professors in University of Waterloo"
    })
};
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
    console.log(body);
    }

    else {
        console.log(body);
        console.log(response);
    }
}
request(options, callback);}
//create_face_list("uwaterloo201701");

function get_group (id){
    var options={
        url:"https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+id,
        method:"GET",
        headers:{
            "Ocp-Apim-Subscription-Key":"bdb4c54829f6451785d8a65da26aad90"
        }
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }

        else {
            console.log(body);
            console.log(response);
        }
    }
    request(options, callback); }

   // get_group("uwaterloo201701");

function create_person (group_id,name,data) {
    var options ={
      url:"https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/"+group_id+"/persons",
        method:"POST",
        headers:{
            "Ocp-Apim-Subscription-Key":"bdb4c54829f6451785d8a65da26aad90"
        },
        body:JSON.stringify({
            "name":name,
            "userData":data
        })
    };
}
function course_list (){
    (uwclient.get('/courses',function (err,res) {
        if (!err){
            console.log(sort_courses(res.data));
        }}));

    function sort_courses (list){
        var arr=[];
        for (var i =0;i<list.length;i++){
            arr.push(list[i].subject+" "+list[i].catalog_number);
        }
        return arr;
    }



}
course_list();