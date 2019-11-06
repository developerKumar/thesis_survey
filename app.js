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

var calculated = parseInt(data.ts4) + parseInt(data.ts6);
var experimental = 0.66*(parseInt(data.ts1) + parseInt(data.ts2) + parseInt(data.ts3));
var resourceful = 0.66*(parseInt(data.ts5) + parseInt(data.ts6) + parseInt(data.ts7));


  var debugScoreTotals = [];
  var implScoreTotals = [];
  var verifScoreTotals = [];

  for (i=1;i<=8;i++) {
    var iStr = i.toString();
    debugScoreTotals[i] = data.dm[iStr] + data.dc[iStr] + data.df[iStr];
    implScoreTotals[i] = data.im[iStr] + data.ic[iStr] + data.if[iStr];
    verifScoreTotals[i] = data.vm[iStr] + data.vc[iStr] + data.vf[iStr];
    console.log("debugScoreTotals(", i, "): ", debugScoreTotals[i])
  }

  var persona = getPersona(calculated, experimental, resourceful);

  db.collection("responses").add({
    data: data,
    persona: persona.name,
    desc: persona.desc
  })
.then(function(docRef) {
  var str = "";
  var respRef = db.collection("responses").limit(50);
  respRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        str = str.concat(`${doc.id} => ${JSON.stringify(doc.data().data)} \n`);
    });
    console.log("Get success: ", str);
    res.render('index', {data: data, str: str, persona: persona.name, desc: persona.desc});
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

function getPersona(calculated, experimental, resourceful) {
  var name = "";
  var desc = "";
  let max = Math.max(calculated, experimental, resourceful);

  if (max == calculated) {
    name = "Calculated";
    desc = "You are calculated in your approach to programming. You are meticulous and thorough, dedicated to understanding the task or problem at a high level.";
  } else if (max == experimental) {
    name = "Experimental";
    desc = "You are experimental in your approach to programming. You prefer tackling the problem or task head-on and getting your hands dirty. You prefer to learn by doing.";
  } else if (max == resourceful) {
    name = "Resourceful";
    desc = "You are resourceful in your approch to programming. You like using (and adding to) your bag of tricks, and you're not afraid to ask for help.";
  }
  var persona = {
      name: name,
      desc: desc
  }

  return persona;
}
