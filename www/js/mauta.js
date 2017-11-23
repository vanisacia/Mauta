$(document).ready(function () {
    //Section Self

    var masterGroup = {
        num: [],
        score: [],
        min: 1,
        max: 59,
        numLen:6,
        initialize: function () {
            for (var x = 1; x <= this.max; x++) {
                masterGroup.num.push(x);
                masterGroup.score.push(0);
            }
        }
    }
    let master = [];
    let numList = [];

    let tStatus = setInterval(function () {
        for (var x = 0; x < masterGroup.numLen; x++) {
            //let number = Math.floor(Math.random() * (masterGroup.max - masterGroup.min) + masterGroup.min);
            numList.push(Math.floor(Math.random() * (masterGroup.max - masterGroup.min) + masterGroup.min));
        }
        master.push(numList);
        console.log(numList);
        numList = [];
        
    },100);

   $("#stop").click(function () {
       try {
           clearInterval(tStatus);
           let line = 0;
           masterGroup.initialize();
           $.each(master, function () {
               let currentLine = $(this);

               $.each(currentLine, function () {
                   let currNum = 0;
                   currNum = parseInt($(this)[0]);
                   let curr = masterGroup.num.indexOf(currNum);
                   let numValue = masterGroup.score[masterGroup.num.indexOf(currNum)];
                   numValue++;
                   //Set score
                   masterGroup.score[masterGroup.num.indexOf(currNum)] = numValue;
               });

               line++;
           });
           let scr = [];
           for (var x = 0; x <= masterGroup.numLen; x++) {

               let lastnum = 0;
               $.each(masterGroup.score, function () {
                   let cur = parseInt($(this)[0]);
                   if (cur > lastnum) {
                       lastnum = cur;
                   }
               });
               let item = masterGroup.score.indexOf(lastnum);
               scr.push(masterGroup.score.indexOf(lastnum));
               masterGroup.score.splice(masterGroup.score.indexOf(lastnum), 1);
               //masterGroup.score = masterGroup.score.filter(item => item !== value)
           }

           let yourNumber = [];
           $.each(scr, function () {
               let cur = parseInt($(this)[0]);
               yourNumber.push(masterGroup.num.indexOf(cur));
           });
           $.each(yourNumber, function () {
               let content = $(this);
               console.log(parseInt($(this)[0]));
           });
       } catch(ex){
           alert(ex);
       }
   });
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
        element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
            'Longitude: ' + position.coords.longitude + '<br />' +
            '<hr />' + element.innerHTML;
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code weired: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        //made a change      here     gh
    }
});

