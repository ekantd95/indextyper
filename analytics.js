var passage_dates = document.getElementById('passage_dates').value;
var passage_values = document.getElementById('passage_values').value;
plot_performance('passage_performance_canvas', passage_dates, passage_values);

var quicktype_dates = document.getElementById('quicktype_dates').value;
var quicktype_values = document.getElementById('quicktype_values').value;
plot_performance('quicktype_performance_canvas', quicktype_dates, quicktype_values);

function plot_performance(canvas, graph_dates, graph_values) {

    var width = document.getElementById(canvas).clientWidth;
    var height = document.getElementById(canvas).clientHeight;
    var graph_height = .9 * height;
    var graph_width = .95 * width;
    var y_lab_width = .03 * width;
    var x_lab_height = 0.1 * height;
    var vertical_unit = graph_height/250;
    // find out how many days the x-axis needs to cover
    graph_dates = graph_dates.split(',');
    graph_values = graph_values.split(',');

    var day_in_ms = 24 * 60 * 60 * 1000;
    var total_time_in_seconds = graph_dates[graph_dates.length - 1] - graph_dates[0];
    var total_time_in_ms = total_time_in_seconds * 1000;
    var total_time_in_days = total_time_in_seconds/(1000 * 60 * 60 * 24);
    var monthNames = ["Jan", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var canvas = document.getElementById(canvas);
    canvas.width =  width * 2;
    canvas.height = height * 2;

    var c = canvas.getContext('2d')
    c.scale(2,2);


    // draw scale lines / y-axis labels
    var label_height = 250 * vertical_unit;
    for (var i = 0; i < 11; i++) {
        c.beginPath();
        c.moveTo(y_lab_width ,(graph_height - ((25 * vertical_unit) * i) )) ;
        c.lineTo(width, graph_height - ((25 * vertical_unit) * i));
        c.fillStyle = '';
        c.strokeStyle = '#f9e7d6';
        c.lineWidth = 1;
        c.stroke();

        // y-axis labels
        c.font = "10px Montserrat";
        c.fillStyle = '#f9e7d6';
        c.textAlign = 'right';
        c.fillText( 25 * i, y_lab_width - 12, label_height);
        label_height -= (25 * vertical_unit);
    }

    // graph performance history line
    c.beginPath();
    c.lineWidth = 1.5;
    c.moveTo( y_lab_width, height - (graph_values[0] * vertical_unit) );
    var percent_of_ms;
    for (var i = 1; i < graph_dates.length; i++) {
        percent_of_ms = (graph_dates[i] - graph_dates[0])/total_time_in_seconds;
        x_coordinate = y_lab_width + percent_of_ms * graph_width;
        y_coordinate = graph_height - (graph_values[i] * vertical_unit);
        c.lineTo(x_coordinate, y_coordinate);
    }
    c.strokeStyle = '#f00';
    c.stroke();

    // graph performance dots
    for (var i = 1; i < graph_dates.length; i++) {
        percent_of_ms = (graph_dates[i] - graph_dates[0])/total_time_in_seconds;
        x_coordinate = percent_of_ms * graph_width + y_lab_width;
        y_coordinate = graph_height - (graph_values[i] * vertical_unit);
        c.beginPath();
        c.arc(x_coordinate, y_coordinate, 1, 0, 2 * Math.PI);
        c.stroke();
    }

    // graph day and noon lines
    // if total is between 24hours and 15 days show time at every 1/7th of the graph
    if (total_time_in_seconds < 86400) {

        // draw x-axis labels
        var date;
        var breadth = 0;
        var date_string;
        var seventh = Math.round(total_time_in_seconds/7);
        var date_label = parseInt(graph_dates[0]);
        for (var i = 0; i < 8; i++) {

            date = new Date(date_label * 1000);
            date_string = date.getDate() + '   ' + date.getHours() + ':' + date.getMinutes();
            c.font = "10px Montserrat";
            c.fillStyle = '#f9e7d6';
            // c.textAlign = 'right';
            c.fillText(date_string, (width - 35)/7 + breadth , height - 12);
            breadth += (width - 35)/7;
            date_label += seventh;
            console.log(date_label);

        } // end of for

    // if it's between 1 and 15 days show every day and noon line
    } else if ( (total_time_in_seconds > 86400) && (total_time_in_seconds < (18 * 86400)) ) { // total_time_in_seconds < 86400

        var first_date_timestamp = graph_dates[0] * 1000;
        var first_date = new Date(first_date_timestamp);
        var year = first_date.getFullYear();
        var month = first_date.getMonth();
        var date = first_date.getDate();
        var first_date_midnight = new Date(year, month, date, 0, 0, 0);
        var first_date_midnight_timestamp = first_date_midnight.getTime();
        var first_date_noon_timestamp = first_date_midnight_timestamp + 86400000/2;

        // create x_coordinates
        var day_ver = [];
        var noon_ver = [];

        for (var i = first_date_midnight_timestamp; i < (graph_dates[graph_dates.length - 1] * 1000); i += 86400000) {
            day_ver.push(i);
            noon_ver.push(i + 86400000/2);
        }

        for (var i = 0; i < day_ver.length; i++) {

            var label_date = new Date(day_ver[i]);
            var strang = monthNames[label_date.getMonth()] + ' ' + label_date.getDate();

            // day lines
            c.beginPath();
            var per = (day_ver[i + 1] - graph_dates[0] * 1000)/total_time_in_ms;
            c.moveTo(per * graph_width + y_lab_width, 0);
            c.lineTo(per * graph_width + y_lab_width, graph_height);
            c.strokeStyle = '#f9e7d6';
            c.lineWidth = 1;
            c.stroke();

            // noon lines
            var noon_per = (noon_ver[i + 1] - graph_dates[0] * 1000)/total_time_in_ms;
            c.beginPath();
            c.setLineDash([4, 4]);
            c.moveTo(noon_per * graph_width + y_lab_width, 0);
            c.lineTo(noon_per * graph_width + y_lab_width, graph_height);
            c.stroke();
            c.setLineDash([]);

            // x-axis labels
            c.font = "10px Montserrat";
            c.fillStyle = '#f9e7d6';
            c.textAlign = 'center';
            c.fillText(strang, (noon_per * graph_width) + y_lab_width , graph_height + 14);

        } // end of for loop


    // if it's over 15 days show a max of 15 lines skipping days in the middle
    } else if (total_time_in_seconds > (18 * 86400)) {
        var first_midnight_graphed = (graph_dates[0] * 1000) - ( (graph_dates[0] * 1000) % day_in_ms ) + 86400000;

        // find total number of day lines between the two stamps
        var last_timestamp_in_ms = graph_dates[graph_dates.length - 1] * 1000;

        // create array of all days between the first and last values
        var day_stamps = [];
        for (var i = first_midnight_graphed; i < last_timestamp_in_ms; i += 86400000) {
            day_stamps.push(i);
        }

        var total_days = day_stamps.length;
        var how_often_to_remove = Math.round(day_stamps.length/10);
        var distilled_stamps = [];

        for (var i = 0; i < day_stamps.length; i++) {
            if (i % how_often_to_remove == 0) {
                distilled_stamps.push(day_stamps[i]);
            }
        }

        // draw the lines and labels
        for (var i = 0; i < distilled_stamps.length; i++) {

            // lines
            var ms_since_first_value = distilled_stamps[i] - (graph_dates[0] * 1000);
            var x_loc = ms_since_first_value/total_time_in_ms * graph_width + y_lab_width;
            c.moveTo(x_loc, 0);
            c.lineTo(x_loc, graph_height);
            c.strokeStyle = '#f9e7d6';
            c.lineWidth = 1;
            c.stroke();

            // labels
            var label_date = new Date(distilled_stamps[i]);
            var strang = monthNames[label_date.getMonth()] + ' ' + label_date.getDate();
            c.font = "10px Montserrat";
            c.fillStyle = '#f9e7d6';
            c.textAlign = 'center';
            c.fillText(strang, x_loc, graph_height + 11);

        };

    } // if it's over 15 days

    // left and right border lines
    c.moveTo(y_lab_width, 0);
    c.lineTo(y_lab_width, graph_height);
    c.stroke();
    c.moveTo(width, 0);
    c.lineTo(width, graph_height);
    c.stroke();


} // end of plot_performance()
