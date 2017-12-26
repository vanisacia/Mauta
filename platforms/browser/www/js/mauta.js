$(document).ready(function () {
    //Section Self


    //  points.sort(function(a, b){return a - b});
    //  document.getElementById("demo").innerHTML = points;

    window.resizeTo("500", "600");
    var dyna_mo = {};
    dyna_mo.key = 'Data';
    for (var x = 0; x < 10; x++) {
        dyna_mo['nam' + x] = x;
    }


    let t = navigator.hardwareConcurrency;
    let selfInfo = {
        'name': 'Mauta',
        'cpu': navigator.cpuClass,
        'language': navigator.language,
        'platform': navigator.platform,
        'age': 'nano byte',
        'address':'www. I live in the cloud. Ha ha'
    };
    //Section Force Data
    var names = {
        'first': 'Ivan',
        'middle': 'Isaac',
        'last': 'Atuam'
    };
    var address = {
        'house number': '7',
        'building name': 'GateHouse View',
        'street': 'Avenue',
        'post code': 'DA9 9XQ',
        'county': 'Greenhithe',
        'province': 'Kent',
        'country': 'United Kingdom'
    };

    //var voices = speechSynthesis.getVoices();
console.log(infinity.add_self('about', selfInfo));
console.log(infinity.add_master('name',names));
console.log(infinity.add_master('address', address));

console.log(infinity.master);
infinity.update_master('address', 'street', 'The Avenue street');
console.log(infinity.get_masterCategory('address'));
   // speechIn.listen();//Made changes
    $("#yousay").val("add category");
    $("#yousay").keyup(function (e) {
        if (e.keyCode === 13) {
            if (mauta.mode == 1) {
                let countries = getCountryList();
                let cities = getCities('Australia');
                $("#yousaid").html($("#yousay").val());
                $("#mautasays").html(infinity.talker_analyze($("#yousay").val(), analyzer));
            } else {
                $("#yousaid").html($("#yousay").val());
                $("#mautasays").html(command.executeCommand($("#yousay").val()));
                $("#yousay").val("");
                $("#yousay").focus();
            }
        }
});
 
    //Geolocation 
    var options = { timeout: 30000 };
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

    function onSuccess(position) {
        var element = document.getElementById('geolocation');
        //element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
        //    'Longitude: ' + position.coords.longitude + '<br />' +
        //    '<hr />' + element.innerHTML;
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code weired: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        //made a change      here     gh
    }

    window.plugins.speechRecognition.isRecognitionAvailable(function (available) {
        if (available) {
            // You can use the speechRecognition
            alert('speech');
        }
    }, function (err) {
        console.error(err);
        alert('no speech');
        });

});

