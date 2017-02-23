/**
 * Created by WangZheZen on 2/10/2017.
 */
///poi/photospheres
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});

    uwclient.get('/poi/photospheres', function (err, res) {
        if (!err) {
            console.log(res.data);
        }
    });
