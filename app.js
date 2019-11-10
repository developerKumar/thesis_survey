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
var metricsDocRef = "metricsDoc";
// db.collection("metrics").doc(metricsDocRef).set({
//     numCalculated: 0,
//     numExperimental: 0,
//     numResourceful: 0,
//     numCalculated_D: 0,
//     numExperimental_D: 0,
//     numResourceful_D: 0,
//     numCalculated_V: 0,
//     numExperimental_V: 0,
//     numResourceful_V: 0,
//     numCalculated_I: 0,
//     numExperimental_I: 0,
//     numResourceful_I: 0
// })

function call_results(req, res) {
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

var calculated = parseInt(data.ts4) + parseInt(data.ts8);
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
  // new ShareBar({'facebookAppId': '549011802567468'});
  var respRef = db.collection("metrics").doc(metricsDocRef);
  respRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      var metrics = docSnapshot.data();
      if (persona.name == "Calculated") {
        metrics.numCalculated += 1
      } else if (persona.name == "Experimental") {
        metrics.numExperimental += 1
      } else if (persona.name == "Resourceful") {
        metrics.numResourceful += 1
      }
      db.collection("metrics").doc(metricsDocRef).set(metrics)
    } else {
      db.collection("metrics").doc(metricsDocRef).set({
          numCalculated: 0,
          numExperimental: 0,
          numResourceful: 0,
          numCalculated_D: 0,
          numExperimental_D: 0,
          numResourceful_D: 0,
          numCalculated_V: 0,
          numExperimental_V: 0,
          numResourceful_V: 0,
          numCalculated_I: 0,
          numExperimental_I: 0,
          numResourceful_I: 0
      })
    }
    res.render('index', {data: data, persona: persona.name, desc: persona.desc, metrics: metrics});
  })
    // querySnapshot.forEach((doc) => {
    //   var metrics = doc.data();
    //   if (persona.name == "Calculated") {
    //     metrics.numCalculated += 1
    //   } else if (persona.name == "Experimental") {
    //     metrics.numExperimental += 1
    //   } else if (persona.name == "Resourceful") {
    //     metrics.numResourceful += 1
    //   }
    //   db.collection("metrics").doc(metricsDocRef).update(metrics)
      // firebase.database().ref(metricsDocRef).set(metrics);
    console.log("Document written with ID: ", docRef.id);
    // res.render('index', {data: data, str: str, persona: persona.name, desc: persona.desc, metrics: });
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
