

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
var mauta={

}
var analyzer = {
    type: 0,
    context: 'none',
    about: 'object',
    isQuest: false,
    isSelf: false,
    nouns: [],
    adjectives: [],
    verbs: [],
    terms: [],
    people: [],
    places: [],
    dates: 0,
    numbers: 0,
    status:0,
    response:''

}
    var phrases = {
        decisionValue: 0,
        decisionContext: 0,
        phrase_qst: ['what', 'whats','when', 'why', 'who', 'how', 'could', 'would', 'it'],
        pronouns: ['all', 'another', 'any', 'anybody', 'anyone', 'anything', 'both', 'each', 'each other', 'either', 'everybody', 'everyone', 'everything', 'few', 'he', 'her', 'hers', 'herself', 'him', 'himself', 'his', 'I', 'it', 'its', 'itself', 'little', 'many', 'me', 'mine', 'more', 'most', 'much', 'my', 'myself', 'neither', 'no one', 'nobody', 'none', 'nothing', 'one', 'one another', 'other', 'others', 'our', 'ours', 'ourselves', 'several', 'she', 'some', 'somebody', 'someone',
            'something', 'that', 'their', 'theirs', 'them', 'themselves', 'these', 'they', 'this', 'those', 'us', 'we', 'what', 'whatever', 'which', 'whichever', 'who', 'whoever', 'whom', 'whomever', 'you', 'your', 'yours', 'yourself', 'yourselve', 'whose'],
        phrase_self: ['you'],
        phrase_self_verbs:['processing','working'],//These are verbs performed by self=you. So when were refer to self and theres a verb in the context it can only these else it return false as not participating
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
 

var phrase_qst = ['who', 'how', 'what', 'why', 'is', 'when', 'whom', 'where', 'are'];
var phrase_self = ['you'];

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
    talker_tokeniz: function (qst) {

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
        return doc.places();
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
        if (phrase_qst.indexOf(doc.list[0].terms[0].text.toLowerCase()) >= 0) {
            analyzer.isQuest = true;
        }
        analyzer.nouns = infinity.talker_nouns(qst);
        analyzer.verbs = infinity.talker_verbs(qst);

        //Get first term
        var term = doc.list[0].terms[0];
        if (phrases.phrase_qst.indexOf(doc.list[0].terms[0].text) > -1) {
            phrases.decisionValue = 1;//1 is a question
        }

       
        analyzer.people = infinity.talker_people(qst)
        analyzer.pronouns = phrases.getpronouns(doc.list[0].terms);
        analyzer.places = infinity.talker_places(qst);
        // var pnoun = nlp.person("Tony Hawk").pronoun();
        analyzer.adjectives = infinity.talker_adjectives(qst); // 'nice', 'juicy'
        analyzer.dates = infinity.talker_dates(qst);      // 'Tuesday Sept. 4rth'

        $.each(analyzer.pronouns, function () {
            if (this === "you" || this === "your" ||this === "youre" || this === "you're") {
                analyzer.isSelf = true;
                return;
            }
        });

        //$.each(analyzer.terms, function () {
        //    if (this.text.toLowerCase() === 'you') {
        //        analyzer.isSelf = true;
        //        return;
        //    }
        //});

      

        infinity.talker_breakDown(analyzer);
        return analyzer.response;
    
    },
    talker_breakDown: function (analyzer) {
        if (analyzer.isQuest) {
            if (analyzer.isSelf) {
                analyzer.response = 'I am';
            }
            //Get meaning of verbs
            if (analyzer.verbs.length > 0) {
                //check each verb and verbs in question can be ignored
                $.each(analyzer.verbs, function () {
                    if (phrases.phrase_qst.indexOf(this.toLowerCase()) < 0 ) {
                        // verbs that are not a question.
                        let verb = this;
                        //sample
                    }
                    if (analyzer.isSelf) {
                        if (phrases.phrase_self_verbs.indexOf(this.toLowerCase())>=0) {
                            // you asking mauta what currently working on
                            analyzer.response = analyzer.response + ' working on blah blah'; //Create object of self activities example : Task, recent task, pending task, propertise of host library.
                            analyzer.status = 1;
                        }
                    }

                    //Checking type of verb.
                    if (this.indexOf("ing") >= 0) {
                        //this is an action type verb
                        // Analyzer ver
                        analyzer.response = 'I am not ' + this;
                    }
                });


            }
            if (analyzer.status === 1) {
                return false;
            }
            //Analyze nouns
            if (analyzer.people.length > 0) {
                //Look person
                if (analyzer.people.length ==1) {
                    let person = analyzer.people[0].firstName;
                    analyzer.response = analyzer.response + ' Who is ' + person + '. Is ' + analyzer.people[0].pronoun + ' a friend';

                }
         
            }
            $.each(analyzer.nouns, function () {
                //split each noun..
                let nouns = this.split(" ");
                $.each(nouns, function () {
                });
                //analyzer.response = analyzer.response +' ' +this;
            });
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

