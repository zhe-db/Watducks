/**
 * Created by tonyz on 1/23/2017.
 */

var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});

function vending (building,floor) {
   // console.log(building,floor);
var p1=new Promise( function (resolve,reject) {
    uwclient.get('/buildings/'+building+'/vendingmachines', function (err, res) {
        if (!err) {
            resolve(res)
        } else {
            reject(res.meta.message);
        }
    })
});

p1.then (function (res){
    get_machines(res.data.vending_machines);
},
function (err){
    console.log(err)
}
);}
function get_machines(res){
    var list=[];
 for (var i=0;i<res.length;i++){
     var str;
     str = res[i].location +" vending machine products: "+ (res[i].products.join(', '));
     list.push(str)
 }
 //console.log('gg');
 console.log(list.join('\n'));
}
//function search_json (json,attr1,target1,attr2){
 //   var list=json.data;
//    for (var i=0; i<list.length;i++){
  //      if (list[i].attr1=="target1"){
  //          return list[i].attr2;
 //       }
  //  }

//function vending_machines (res,building,floor){
 //   var list =[];
 //   for (var i=0;i<res.length;i++){
  //      if (res[i].location.charAt(0)==floor){
   //         list.push(res[i].products);
   //     }
   // }
  //  console.log(list);
//}

function vending_machine_ (entity) {
    for (var i=0;i<entity.length;i++){
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
var entity_1 =[ { entity: 'dc',
    type: 'string',
    startIndex: 0,
    endIndex: 1,
    score: 0.9694855,
    resolution: {} },
    { entity: '1st',
        type: 'builtin.ordinal',
        startIndex: 3,
        endIndex: 5,
        score: 0.999943435,
        resolution: {} } ];

vending('STC',2);
//vending("DC",1);
vending_machine_(entity_1);