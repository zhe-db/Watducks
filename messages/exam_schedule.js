/**
 * Created by WangZheZen on 2/10/2017.
 */
/**
 * Created by WangZheZen on 2/10/2017.
 */
var uwaterlooApi=require('uwaterloo-api');
var uwclient = new uwaterlooApi({
    API_KEY : '743887d93f1df944a7acae0f78741746 '
});
// Module for getting exam schedule

exports.exam_schedule = function exam_schedule (subject, course_number) {
    uwclient.get('/courses/' + subject + "/" + course_number + '/examschedule', function (err, res) {
        if (!err) {
            console.log("Here is " + subject.toUpperCase() + course_number+" final schedule:");
            console.log(res.data.sections[0].start_time + " - "
                + res.data.sections[0].end_time + " " + res.data.sections[0].day +
                " " + res.data.sections[1].date + "\n" + res.data.sections[0].location);
        }
    });
};

// exam_schedule("Japan",'101R');
// console.log("gggg".search(/\d/g));