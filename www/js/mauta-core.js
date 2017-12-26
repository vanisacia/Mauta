













var mauta = {
    mode: 0,//0 and 1 : 0 for command mode and 1 for analytic mode
    name: 'mauta',
    setMode: function (m) {
        this.mode = m;
    },
    setName: function (n) {
        this.name = n;
    },

    
}
var dyna_mo = {};
var commonResponse = {
    status: 0,
    command: '',
    qstKey: '',
    qstValue: '',
    response:'',
    number:0
}
var command = {
    name: [],
    method: [],
    number:[],
    mode: 0,//0 means not receiving a command.
    initialize:function(){
       
        this.name.push("add categories");
        this.method.push("addCategory");
        this.number.push(1);
        this.name.push("add category");
        this.method.push("addCategory");
        this.number.push(1);

        this.name.push("view category");
        this.method.push("displayCategory");
        this.number.push(2);

        this.name.push("categories");
        this.method.push("getAllCategories");
        this.number.push(3);

        this.name.push("run numbers");
        this.method.push("runNumbers");
        this.number.push(4);

        this.name.push("stop numbers");
        this.method.push("stopNumbers");
        this.number.push(5);
    },
    reset: function () {
        command.mode = 0;
        dyna_mo = {};
        commonResponse.command = '';
        commonResponse.qstKey = '';
        commonResponse.qstValue = '';
        commonResponse.response = '';
        commonResponse.status = 0;
        commonResponse.number = 0;
    },
    passCommand:function(command) {
        this.initialize();
        if (command === mauta.name)
            return "activation";
        let com = { name: '', method: '', number:0 };
        if (this.name.indexOf(command) >= 0) {
            com.method = this.method[this.name.indexOf(command)];
            com.name = this.name[this.name.indexOf(command)];
            com.number = this.number[this.name.indexOf(command)];
        }
        return com;
        //check if command
    },
    executeCommand:function(inputCommand) {
        if (command.mode === 0) {
            let com = this.passCommand(inputCommand);
            if (com) {
                if (!(com === "activation")) {

                    let codeToExecute = "command." + com.method + "()";
                    let tmpFunc = new Function(codeToExecute);
                    tmpFunc();

                    //execute dynamic function window[functionName](parameter);
            
                    commonResponse.command = com.method;
                    commonResponse.number = com.number;
                    command.mode = 1;
                    if (codeToExecute == "command.runNumbers()") {
                        command.mode = 0;
                    }
                    if (codeToExecute == "command.stopNumbers()") {
                        let numbers = '';

                        $.each(commonResponse.response, function () {
                            numbers = numbers + this + ",";
                        });
                        commonResponse.response = numbers;
                        command.mode = 0;
                    }
                    return commonResponse.response;
                } else {
                    //reset
                }
            }
        } else {
            if (commonResponse.number == 1) {
                if (inputCommand == "end" || inputCommand == "complete") {
                    //add category to master
                    let respond = 'Saving category ..';
                    if ($.isEmptyObject(dyna_mo)) {
                        respond = 'Saving Category Cancelled'
                    } else {
                        infinity.add_master(commonResponse.qstKey, dyna_mo);
                        respond = 'Category Saved ..';
                    }
                    //Reset
                    command.reset();
                    return respond;
                }
                let codeToExecute = "command." + commonResponse.command + "('" + inputCommand + "')";
                let tmpFunc = new Function(codeToExecute);
                tmpFunc();
                return commonResponse.response;
            
            }
            if (commonResponse.number == 2) {
                //display category
                if (inputCommand == "end" || inputCommand == "complete") {
                    let respond = 'Category Search Cancelled..';
                    
                    //Reset
                    command.reset();

                    return respond;
                }
                let codeToExecute = "command." + commonResponse.command + "('" + inputCommand + "')";
                let tmpFunc = new Function(codeToExecute);
                tmpFunc();
                let respond = commonResponse.response;
                if (commonResponse.status == 2) {
                    command.reset();
                }
                return respond;
            }
        }
    },
    getCategory:function(name) {
        var state = infinity.check_master_state(category);
        if (state) {
            infinity.get_masterCategory(name);
        }
    },
    checkCategory:function(name) {
        return infinity.check_master_state(category);
    },
    displayCategory:function(name) {
        if (name) {
            let category = infinity.getCategory(name);
            if (category) {
                //create display for this category
                let categoryHtml = command.createOutputDisplayCategory(category);
                $(".dyn_output").html(categoryHtml);
                commonResponse.response = "Your " + name + " category is listed below";
                commonResponse.status = 2;

            } else {
                commonResponse.response = category +" Category doesnt exist";
            }
        } else {
            commonResponse.response = "Type Category Name";
            return;
        }
    },
    runNumbers: function () {
        commonResponse.response = numbGenerator.runNumber();
    },
    stopNumbers: function () {
        commonResponse.response = numbGenerator.stopNumbers();

        return 0;
    },
    addCategory:function(value) {
        let response;
        if (commonResponse.status === 0) {
            //ask you user to for category name
            commonResponse.status = 1;
            commonResponse.response = "Type Category Name"
            return true;
        }
        if (commonResponse.status === 1) {
            //Save categroy name
           // dyna_mo.key = value;
            commonResponse.qstKey = value;
            commonResponse.status = 2;
            commonResponse.response = "Type Category Value Name"
            return true;
            //ask you for category title
         
        }
        if (commonResponse.status === 2) {
            //ask you for category value
            dyna_mo[value] = '';
            //commonResponse.valueName = key;            
            commonResponse.status = 3;
            commonResponse.qstValue = value;
            commonResponse.response = "Type Category Value Content"
            return true;
        }
        if (commonResponse.status === 3) {
            //ask you for category value
            dyna_mo[commonResponse.qstValue] = value;
            //commonResponse.valueName = key;            
            commonResponse.status = 2;
            commonResponse.response = "Type Category Another Value Name"
            return true;
        }
    },
    createOutputDisplayCategory: function (category) {
        let wrapper = document.createElement("div");
        wrapper.setAttribute("class", "dyn_output");
        $.each(category, function (key, value) {

            let row = document.createElement("div");
            row.setAttribute("class", "row");

            let tkey = document.createElement("span");
            let keyText = document.createTextNode(key);
            tkey.appendChild(keyText);

            let tvalue = document.createElement("span");
            let valueText = document.createTextNode(value);
            tvalue.appendChild(valueText);

            row.appendChild(tkey);
            row.appendChild(tvalue);
            wrapper.appendChild(row);
        });
        return wrapper;
    }
};


var response = {
    type: 0,
    context: 'none',
    about: 'object',
    pronouns: [],
    verbs: [],
    adjectives: [],
    nouns: [],
    people: [],
    places: [],
    dates: 0,
    numbers: 0
};

var analyzer = {
    type: 0,
    context: 'none',
    about: 'object',
    isQuest: false,
    isSelf: false,
    isSelfFeeling:false,
    responseType: 0,//exact response what, when, where 0. Descriptive answers why 1
    responseCategory:0,// 0 means the question notion is generic and 1 means is a specific question that is stored
    nouns: [],
    adjectives: [],
    verbs: [],
    terms: [],
    people: [],
    places: [],
    dates: 0,
    numbers: 0,
    status:0,
    response: '',
    reset: function () {
        for (var prop in this) {
            if (!(typeof this[prop] === "function")) {
                this[prop] = [];
            }
        }
    }

}
var analyzerWordMeaning = {
    word: [],
    descFull: [],
    descSimple: [],
    accessMeaning: function (wrd) {
        let meaning = 'Found the meaning of this word';
        descFull[word.indexOf(wrd)].push(meaning);
    },
    reset: function () {
        for (var prop in this) {
            if (!(typeof this[prop] === "function")) {
                this[prop] = [];
            }
        }
    }
}
var phrases = {
        decisionValue: 0,
        decisionContext: 0,
        phrase_qst: ['what', 'whats', 'when', 'why', 'who', 'how', 'could', 'would', 'it', 'are','is','tell'],
        phrase_elevation: ['why'],
        pronouns: ['all', 'another', 'any', 'anybody', 'anyone', 'anything', 'both', 'each', 'each other', 'either', 'everybody', 'everyone', 'everything', 'few', 'he', 'her', 'hers', 'herself', 'him', 'himself', 'his', 'I', 'it', 'its', 'itself', 'little', 'many', 'me', 'mine', 'more', 'most', 'much', 'my', 'myself', 'neither', 'no one', 'nobody', 'none', 'nothing', 'one', 'one another', 'other', 'others', 'our', 'ours', 'ourselves', 'several', 'she', 'some', 'somebody', 'someone',
            'something', 'that', 'their', 'theirs', 'them', 'themselves', 'these', 'they', 'this', 'those', 'us', 'we', 'what', 'whatever', 'which', 'whichever', 'who', 'whoever', 'whom', 'whomever', 'you', 'your', 'yours', 'yourself', 'yourselve', 'whose'],
        phrase_self: ['you', 'your', 'youre', 'yourself', "you're"],
        phrase_self_verbs: ['processing', 'working'],//These are verbs performed by self=you. So when were refer to self and theres a verb in the context it can only these else it return false as not participating
        phrase_self_propertise:['name','address','age','old','color','sex','gender','reproduction','about', 'yourself'], //where isSelf a
        getpronouns: function (terms) {
            var _terms = [];
            $.each(terms, function () {
                if (phrases.pronouns.indexOf(this.text) > -1) {
                    _terms.push(this.text);
                }
            });
            return _terms;
        }
};

var infinity = {
    self: [],
    master: [],
    people: [],
    knowledge_base: [],
    add_master: function (category, value) {
        var state = infinity.check_master_state(category);
        if (state === false) {
            var dyna_mo = {};
            dyna_mo.key = category;
            dyna_mo.value = value;
            infinity.master.push(dyna_mo);
        }
        return state;
    },
    getCategory: function (category) {
        let categoryItem;
        $.each(infinity.master, function (key, value) {
            if (this.key === category) {
                categoryItem = this.value;
            }
        });
        return categoryItem;
    },
    check_master_state: function (category) {
        var state = false;
        $.each(infinity.master, function (key, value) {
            if (this.key === category) {

                state = true;
                return false;
            }
        });
        return state;
    },
    add_self: function (category, value) {
        var state = infinity.check_self_state(category);
        if (state === false) {
            var dyna_mo = {};
            dyna_mo.key = category;
            dyna_mo.value = value;
            infinity.self.push(dyna_mo);
        }
        return state;
    },
    check_self_state: function (category) {
        var state = false;
        $.each(infinity.self, function (key, value) {
            if (this.key === category) {

                state = true;
                return false;
            }
        });
        return state;
    },
    update_master: function (category, valueKey, valueName) {
        var keyId = 0;
        var dyna_mo = {};
        $.each(infinity.master, function (key, value) {
            if (this.key === category) {
                dyna_mo.key = this.key;
                dyna_mo.value = this.value;
                dyna_mo.value[valueKey] = valueName;
                infinity.master[keyId] = dyna_mo;
                return false;
            }
            keyId += 1;

        });
    },
    get_masterCategory: function (category) {
        let categoryItem;
        $.each(infinity.master, function (key, value) {
            if (this.key === category) {
                categoryItem = this;
            }
        });
        return categoryItem;
    },
    talker_tokeniz: function (qst) {

    },
    talker_question: function (qst) {
     return   nlp(qst).questions().data().length;
    },
    talker_topics: function (qst) {
      return  nlp(qst).topics().data();
    },
    talker_verbs: function (qst) {
        var doc = nlp(qst);
        return doc.verbs().out('array');
    },
    talker_nouns: function (qst) {
        var doc = nlp(qst);
        return doc.nouns().out('array');
    },
    talker_places: function (qst) {
        var doc = nlp(qst);
        return doc.places().out('array');;
    },
    talker_adjectives: function (qst) {
        var doc = nlp(qst);
        return doc.adjectives();
    },
    talker_people: function (qst) {
        var doc = nlp(qst);
        return doc.people().data();
    },
    talker_dates: function (qst) {
        var doc = nlp(qst);
        return doc.dates(); 
    },
    talker_analyze: function (qst, analyzer) {
        var doc = nlp(qst);
        analyzer.terms = doc.list[0].terms;
        //Get first term
        if (phrases.phrase_qst.indexOf(doc.list[0].terms[0].text.toLowerCase()) >= 0) {
            analyzer.isQuest = true;
        }
        analyzer.nouns = infinity.talker_nouns(qst);
        analyzer.verbs = infinity.talker_verbs(qst);

        //Get first term
        var term = doc.list[0].terms[0];
        if (phrases.phrase_qst.indexOf(doc.list[0].terms[0].text) > -1) {
            phrases.decisionValue = 1;//1 is a question
        }

        let q = infinity.talker_question(qst);
        analyzer.people = infinity.talker_people(qst)
        analyzer.pronouns = phrases.getpronouns(doc.list[0].terms);
        analyzer.places = infinity.talker_places(qst);
        // var pnoun = nlp.person("Tony Hawk").pronoun();
        analyzer.adjectives = infinity.talker_adjectives(qst); // 'nice', 'juicy'
        analyzer.dates = infinity.talker_dates(qst);      // 'Tuesday Sept. 4rth'

        $.each(analyzer.pronouns, function () {
            if(this == "you" || this == "your" ||this == "youre" || this =="you're") {
                analyzer.isSelf = true;
                return;
            }
        });
        $.each(analyzer.terms, function () {
            if (phrases.phrase_self.indexOf(this.text) >= 0) {
                analyzer.isSelf = true;
                return;
            }
        });
        if (analyzer.isSelf) {
            if (analyzer.isQuest) {
                //getting response type
                analyzer.responseType = 0;
                if (phrases.phrase_elevation.indexOf(doc.list[0].terms[0].text.toLowerCase()) >= 0) {
                    analyzer.responseType = 1;
                    analyzer.responseCategory = 1;
                }
            }
        }
        analyzer.response = "";

        infinity.talker_breakDown(analyzer);
        analyzerWordMeaning.reset();
        let t = analyzerWordMeaning;
        return analyzer.response;
    
    },
    talker_breakDown: function (analyzer) {
        if (analyzer.isQuest) {
            if (analyzer.isSelf) {
                if (analyzer.responseType === 0) {
                    analyzer.response = 'I am ';
                } else {
                    analyzer.response = 'Because '; //This requires a descriptive response like 
                }
                if (analyzer.nouns.length === 0) {
                    if (analyzer.pronouns) {
                        if (phrases.phrase_self.indexOf(analyzer.pronouns[0])>=0) {
                            //This means self feeling . How are you.
                            analyzer.response = 'My feelings are still under development ... Wish I have an answer';
                            analyzer.isSelfFeeling = true;
                        }
                    }
                }
            }
        }
        if (!(analyzer.isSelfFeeling)) {
            //Get meaning of verbs
            if (analyzer.verbs.length > 0) {
                //check each verb and verbs in question can be ignored
                $.each(analyzer.verbs, function () {
                    if (phrases.phrase_qst.indexOf(this.toLowerCase()) < 0) {
                        // verbs that are not a question.
                        let verb = this;
                        //sample
                    }
                    if (analyzer.isSelf) {
                        if (phrases.phrase_self_verbs.indexOf(this.toLowerCase()) >= 0) {
                            // you asking mauta what currently working on
                            analyzer.response = analyzer.response + ' working on blah blah'; //Create object of self activities example : Task, recent task, pending task, propertise of host library.
                            analyzer.status = 1;
                        }
                    }
                    //Checking type of verb.
                    if (this.indexOf("ing") >= 0) {
                        //this is an action type verb
                        // Analyzer verb
                        analyzer.response = 'I am not ' + this;
                    }
                });
            }
            if (analyzer.status === 1) {
                return false;
            }

            if (analyzer.people.length > 0) {
                //Look person
                if (analyzer.people.length == 1) {
                    let person = analyzer.people[0].firstName;
                    analyzer.response = ' Who is ' + person + '. Is ' + analyzer.people[0].pronoun + ' a friend';
                }
            }
            //Analyze nouns
            if (analyzer.nouns) {
                if (analyzer.nouns.length == 1) {
                    let nounNalyzed = analyzer.nouns[0].split(" ");
                    $.each(nounNalyzed, function () {
                        analyzerWordMeaning.word.push(this);
                    });
                }
                else {
                    $.each(analyzer.nouns, function () {
                        //split each noun..
                        let nouns = this.split(" ");
                        $.each(nouns, function () {
                        });
                        //analyzer.response = analyzer.response +' ' +this
                    });
                }
            }
            if (analyzer.isSelf) {
                let currentPropAnswer;
                if (analyzerWordMeaning.word) { // Check nouns first for a quick reference if no reference found then check all terms
                    $.each(analyzerWordMeaning.word, function () {
                        if (phrases.phrase_self_propertise.indexOf(this.trim().toLowerCase()) >= 0) {
                            //this word has to do with self property. look into self for about this answer
                            currentPropAnswer = 'My ' + this + ' is ' + infinity.self[0].value[this];
                            return false;
                        }
                    });
                    if (!(currentPropAnswer)) {
                        $.each(analyzer.terms, function () {
                            if (phrases.phrase_self_propertise.indexOf(this.text.trim().toLowerCase()) >= 0) {
                                //this word has to do with self property. look into self for about this answer
                                if (this.text.trim().toLowerCase() === "about" || this.text.trim().toLowerCase() === "yourself") {
                                    let ans = "";
                                    //Get all info
                                    for (var obj in infinity.self[0].value) {

                                        ans = ans + "<div > My " + obj + " is " + infinity.self[0].value[obj] + "</div>";
                                    }
                                    currentPropAnswer = ans;
                                    return false;
                                }
                            }
                        });
                    }

                    if (currentPropAnswer) {
                        analyzer.response = currentPropAnswer;
                    }
                }
            }
        }
     },
    start: function () {
        console.log("listener started");
    },
   
    phrases_number: function (sent_) {
        var r = nlp(sent_).values().toNumber();
        return r.out('text');

    },
    dicision: function (task, phrases) {

    }
};

var speechIn = {
    listen: function () {
        var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 5;
        recognition.start();

        recognition.onresult = function (event) {
            console.log('You said: ', event.results[0][0].transcript);
        };
    }
}





var numbGenerator = {
    num: [],
    score: [],
    min: 1,
    max: 59,
    numLen: 6,
    tStatus: 0,
    master: [],
    numList :[],
    initialize: function () {
        for (var x = 1; x <= this.max; x++) {
            numbGenerator.num.push(x);
            numbGenerator.score.push(0);
        }
    },
    runNumber: function () {
        numbGenerator.master = [];
        numbGenerator.numList = [];
        numbGenerator.tStatus = setInterval(function () {
            for (var x = 0; x < numbGenerator.numLen; x++) {
                //let number = Math.floor(Math.random() * (numbGenerator.max - numbGenerator.min) + numbGenerator.min);
                numbGenerator.numList.push(Math.floor(Math.random() * (numbGenerator.max - numbGenerator.min) + numbGenerator.min));
            }
            numbGenerator.master.push(numbGenerator.numList);
            console.log(numbGenerator.numList);
            let cur = '';
            $.each(numbGenerator.numList, function () {
                cur = cur + this+ ',';
                let div = '<div> ' + cur + '</div>';
                $("#idcontent").prepend(cur + '\r\n');
                //$("#idcontent").append(cur +'\r\n');
            
            });
            numbGenerator.numList = [];
           
            $("#idcontent").append(cur);
        }, 100);
    },
    stopNumbers: function () {
        try {
            clearInterval(numbGenerator.tStatus);
            let line = 0;
            numbGenerator.initialize();
            $.each(numbGenerator.master, function () {
                let currentLine = $(this);

                $.each(currentLine, function () {
                    let currNum = 0;
                    currNum = parseInt($(this)[0]);
                    let curr = numbGenerator.num.indexOf(currNum);
                    let numValue = numbGenerator.score[numbGenerator.num.indexOf(currNum)];
                    numValue++;
                    //Set score
                    numbGenerator.score[numbGenerator.num.indexOf(currNum)] = numValue;
                });

                line++;
            });
            let scr = [];
            for (var x = 0; x <= numbGenerator.numLen; x++) {

                let lastnum = 0;
                $.each(numbGenerator.score, function () {
                    let cur = parseInt($(this)[0]);
                    if (cur > lastnum) {
                        lastnum = cur;
                    }
                });
                let item = numbGenerator.score.indexOf(lastnum);
                scr.push(numbGenerator.score.indexOf(lastnum));
                numbGenerator.score.splice(numbGenerator.score.indexOf(lastnum), 1);
                //numbGenerator.score = numbGenerator.score.filter(item => item !== value)
            }

            let yourNumber = [];
            
            $.each(scr, function () {
                let cur = parseInt($(this)[0]);
             
                yourNumber.push(numbGenerator.num.indexOf(cur));
            });
           
            $.each(yourNumber, function () {
                let content = $(this);
                console.log(parseInt($(this)[0]));
               
            });
            return yourNumber;
        } catch (ex) {
            alert(ex);
        }
    }
}

