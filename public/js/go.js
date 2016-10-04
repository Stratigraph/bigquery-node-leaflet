var mapGlobal;

$(document).ready(function () {

   var mymap = L.map('leafletmap').setView([40.518538, 44.704814], 4);
   L.tileLayer('https://api.mapbox.com/styles/v1/dgmurphy/citrgk3hm00122il4ma9gy29r/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGdtdXJwaHkiLCJhIjoiY2l0cTM4NTI2MDBiZjJvbXN6ZWZxMzQ4NSJ9.0cshlThPWiLeJYgcWGQXCg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    }).addTo(mymap);

   mapGlobal = mymap;

    // Saved data set #1
    $("#gdeltmockform").submit(function (e) {
        e.preventDefault();

        $("#bqgdeltmockbtn").prop("disabled",true);
        $("#mockspin").css("display", "inline-block");

        clearMap();

        $.post('/bqgdeltmock', {datafile: 'gdeltSample2k.json'}, printResponse);

        this.reset();
    });

    // Saved data set #2
    $("#gdeltmockform2").submit(function (e) {
        e.preventDefault();

        $("#bqgdeltmockbtn2").prop("disabled",true);
        $("#mockspin2").css("display", "inline-block");

        clearMap();

        $.post('/bqgdeltmock', {datafile: 'gdeltSample10k.json'}, printResponse);

        this.reset();
    });

    // Saved data set #3
    $("#gdeltmockform3").submit(function (e) {
        e.preventDefault();

        $("#bqgdeltmockbtn3").prop("disabled",true);
        $("#mockspin3").css("display", "inline-block");

        clearMap();

        $.post('/bqgdeltmock', {datafile: 'gdeltSample15k.json'}, printResponse);

        this.reset();
    });

    // Big Query API call
    $("#bqApiForm").submit(function (e) {
        e.preventDefault();

        $("#bqgdeltbtn").prop("disabled",true);
        $("#gdeltspin").css("display", "inline-block");

        clearMap();

        var dayval = $("[name='dayinput']").val();
        var monthval = $("[name='monthselect']").val();
        var yearval = $("[name='yearselect']").val();
        var limitval = $("[name='eventlimit']").val();

        $.post('/bqgdelt', {day: dayval, month: monthval, year: yearval, limit: limitval}, printResponse);
        this.reset();
    });

    // Clear the map
    $("#clearform").submit(function (e) {
        e.preventDefault();
        clearMap();
        $('#bqresponse').html("Empty map.");
        this.reset();
    });

    // Validate day input
    $("#dayinput").focusout(function() {
        validateDay();
    });

    // Validate query limit input
    $("#bqlimit").focusout(function() {
        validateQueryLimit();
    });



});

function validateDay() {
    var dayint = parseInt($("#dayinput").val());
    if (dayint > 31) {
        $("#dayinput").val("31"); 
    }
}


function validateQueryLimit() {
    var qlimit = parseInt($("#bqlimit").val());
    if (qlimit > 10000) {
        $("#bqlimit").val("10000"); 
    }
}



function enableForms() {

    $("#mockspin").css("display", "none");
    $("#mockspin2").css("display", "none");
    $("#mockspin3").css("display", "none");


    $("#bqgdeltmockbtn").prop("disabled",false);
    $("#bqgdeltmockbtn2").prop("disabled",false);
    $("#bqgdeltmockbtn3").prop("disabled",false);


    $("#gdeltspin").css("display", "none");
    $("#bqgdeltbtn").prop("disabled",false);
}

function printResponse(resp) {

    drawDots(resp.events);
    $('#bqresponse').html(resp.status);
    $('#legend').css("display", "block");
    enableForms();
}


function drawDots (pointsArray) {
    pointsArray.forEach(function (point) {

        //if tone is missing, set it to zero
        if( !point.tone ) {
            point.tone = 0.0;
        }

        //Only render if we have location data
        if ( (point.lat) && (point.long) ) {
            makeDot(point);
        }
        
    });
}

function makeDot(point) {

    dotColor = getDotColor(point);
    dotSize = getDotSize(point);

    var circle = L.circle([point.lat, point.long], {
        color: dotColor,
        stroke: false,
        fillColor: dotColor,
        fillOpacity: 0.1,
        radius: dotSize
    }).addTo(mapGlobal);

}

function getDotColor(point) {

    // Green for positive tone, red for negative
    var tone = point.tone;
    var color = "blue";
    if(tone < 0.0) {
        color = "red";
    }
    return color;
}

function getDotSize(point) {


    var toneMag = Math.abs(point.tone);

    //GDLET: Tone magnitude can vary from 0 100 but 0 to 10 is common
    // So clamp it from 1 to 10
    if(toneMag > 10.0) {
        toneMag = 10.0;
    } 
    else if (toneMag < 0.5) {
        toneMag = 1.0;
    }

    // Convert to meters
    var dotSize = 40000.0 * toneMag;

    return dotSize;
}


function clearMap() {

    $('#bqresponse').html("Updating...");
    $('#legend').css("display", "none");

    for(i in mapGlobal._layers) {
        if(mapGlobal._layers[i]._path != undefined) {
            try {
                mapGlobal.removeLayer(mapGlobal._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + mapGlobal._layers[i]);
            }
        }
    }
}

function doMock() {
    $("#bqgdeltmockbtn").prop("disabled",true);
    $('#bqresponse').html("Initializing...");
    $.post('/bqgdeltmock', {param1: $('#param1').val()}, printResponse);
    $("#mockspin").css("display", "inline-block");
}
