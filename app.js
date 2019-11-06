var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

var d3 = require("d3");

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyA7QXDAjJhGlmh2SGOprMAVlOtVBy_2RQo',
  authDomain: 'contextualfactors-22ef7.firebaseapp.com',
  databaseURL: "https://contextualfactors-22ef7.firebaseio.com",
  projectId: 'contextualfactors-22ef7'
});

var db = firebase.firestore();
var ref = firebase.database().ref;

function call_results(req, res) {
  var options = {
    args:
    [
    ]
  }
  var data = {
    dm: JSON.parse(req.query.dm),
    im: JSON.parse(req.query.im),
    vm: JSON.parse(req.query.vm),
    if: JSON.parse(req.query.if),
    vf: JSON.parse(req.query.vf),
    df: JSON.parse(req.query.df),
    vc: JSON.parse(req.query.vc),
    dc: JSON.parse(req.query.dc),
    ic: JSON.parse(req.query.ic),
    ts1: JSON.parse(req.query.total1),
    ts2: JSON.parse(req.query.total2),
    ts3: JSON.parse(req.query.total3),
    ts4: JSON.parse(req.query.total4),
    ts5: JSON.parse(req.query.total5),
    ts6: JSON.parse(req.query.total6),
    ts7: JSON.parse(req.query.total7),
    ts8: JSON.parse(req.query.total8)
  }

/*
  Calculated = score4 + score6

Experimental = ⅔*(score1 + score2 + score3 )

Resourceful = ⅔*(score5 + score6 + score7 )
*/

console.log("TS FOUR:::::", data.ts4);
console.log("TS FOUR INT?:::::", parseInt(data.ts4));

var calcuated = parseInt(data.ts4) + parseInt(data.ts6);
var experimental = 0.66*(parseInt(data.ts1) + parseInt(data.ts2) + parseInt(data.ts3));
var resourceful = 0.66*(parseInt(data.ts5) + parseInt(data.ts6) + parseInt(data.ts7));

let max = Math.max(calcuated, experimental, resourceful);

var persona = "";
var personaDesc = "";

if (max == calcuated) {
  persona = "Calculated";
  personaDesc = "You are calculated in your approach to programming. You are meticulous and thorough, dedicated to understanding the task or problem at a high level.";
} else if (max == experimental) {
  persona = "Experimental";
  personaDesc = "You are experimental in your approach to programming. You prefer tackling the problem or task head-on and getting your hands dirty. You prefer to learn by doing.";
} else if (max == resourceful) {
  persona = "Resourceful";
  personaDesc = "You are resourceful in your approch to programming. You like using (and adding to) your bag of tricks, and you're not afraid to ask for help.";
}


  var debugScoreTotals = [];

  var implScoreTotals = [];

  var verifScoreTotals = [];

  for (i=1;i<=8;i++) {
    console.log(">>>>DATA.DM: ", data.dm)
    console.log(">>>>DATA.DM1 backets: ", data.dm[iStr])
    var iStr = i.toString();

    debugScoreTotals[i] = data.dm[iStr] + data.dc[iStr] + data.df[iStr];
    implScoreTotals[i] = data.im[iStr] + data.ic[iStr] + data.if[iStr];
    verifScoreTotals[i] = data.vm[iStr] + data.vc[iStr] + data.vf[iStr];
    console.log("debugScoreTotals(", i, "): ", debugScoreTotals[i])
  }



  db.collection("responses").add({
    data: data,
    persona: persona,
    desc: personaDesc
  })
.then(function(docRef) {
  var str = "";
  var respRef = db.collection("responses").limit(50);
  respRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        str = str.concat(`${doc.id} => ${JSON.stringify(doc.data().data)} \n`);
    });
    console.log("Get success: ", str);
    res.render('index', {data: data, str: str, persona: persona, desc: personaDesc});
});
    // res.render('index', {data: data, str: str});
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

}
app.get('/results', call_results);

app.listen(3000, function () {
  console.log('server running on port 3000');
})
