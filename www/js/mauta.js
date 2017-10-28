$(document).ready(function () {
    //Section Self
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
    console.log(infinity.add_self('about', selfInfo));
console.log(infinity.add_master('name',names));
console.log(infinity.add_master('address',address));

console.log(infinity.master);
infinity.update_master('address','street','The Avenue');
console.log(infinity.master);


    $("#yousay").keyup(function (e) {
        if (e.keyCode === 13) {
            var countries = getCountryList();
            var cities = getCities('Australia');
            $("#yousaid").html($("#yousay").val());
            $("#mautasays").html(infinity.talker_analyze($("#yousay").val(), analyzer));

        }
});
 
    //Geolocation 
    var options = { timeout: 30000 };
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

    function onSuccess(position) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
            'Longitude: ' + position.coords.longitude + '<br />' +
            '<hr />' + element.innerHTML;
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code weired: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        //made a change
    }
});

