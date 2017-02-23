/**
 * Created by tonyz on 1/23/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
function get_schedule(building,room,time,week){
var p1 = new Promise(
    function (resolve,reject) {
        uwclient.get('/buildings/'+building+'/'+room+'/courses',function (err,res) {
            if (!err){
                resolve(check_room(res,time,week));
            }
            else{
                reject(res.meta.message);
            }
        })
    });
    p1.then(function (res) {
        console.log(res);

    },
        function (err) {
        console.log(err);
        }
    );}
var arr=[];
    function check_room (res,time,week_days){
        var list =res.data;
        if (!list){
            return "Wrong room number";
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
            return quicksort(arr);
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
            get_schedule("DC",1350,"08:00","M");