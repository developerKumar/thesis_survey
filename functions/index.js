const functions = require('firebase-functions');
var express = require('express');
var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
// using app.use to serve up static CSS files in public/assets/ folder when /public link is called in ejs files
// app.use("/route", express.static("foldername"));
app.use('/public', express.static('public'));
const firebase = require("firebase");
let ejs = require("ejs");
let fs = require('fs');
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
var count = 0;

exports.results = functions.https.onRequest((req, res) => {
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
    ts8: JSON.parse(req.query.total8),
    affect: req.query.affect
  }
  console.log(data.affect)

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
  }


  var persona = getPersona(calculated, experimental, resourceful);
  var subPersonas = getSubPersonas(debugScoreTotals, implScoreTotals, verifScoreTotals);
  // console.log(">>>>SUB PERSONAS!!!!: ", JSON.stringify(subPersonas))
  db.collection("responses").add({
    data: data,
    persona: persona.name,
    desc: persona.desc
    })
.then(function(docRef) {
  var respRef = db.collection("metrics").doc(metricsDocRef);
  respRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      var docData = docSnapshot.data()
      var metrics = updateMetrics(docData, persona, subPersonas, calculated, experimental, resourceful, count);
      db.collection("metrics").doc(metricsDocRef).set(metrics)
    }
    else {
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
          numResourceful_I: 0,
          avgCalculated: 0,
          avgExperimental: 0,
          avgResourceful: 0
      })
    }
    let shareTitle = encodeURIComponent("Your programming style is " + persona.name + "! ")
    let shareDesc = encodeURIComponent(persona.desc)
    let twitter = '<a class="resp-sharing-button__link" href="https://twitter.com/intent/tweet/?text=' + shareTitle + shareDesc + '%20Discover%20your%20programming%20persona%20here%21%20&amp;url=https%3A%2F%2Fgmu.az1.qualtrics.com%2Fjfe%2Fform%2FSV_cvDj3Vd3ZZvqAVT" target="_blank" rel="noopener" aria-label="Twitter">'
    let linkedin = '<a class="resp-sharing-button__link" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=https%3A%2F%2Fgmu.az1.qualtrics.com%2Fjfe%2Fform%2FSV_cvDj3Vd3ZZvqAVT&amp;title=' + shareTitle + "&amp;summary=" + shareDesc + '%20Discover%20your%20programming%20persona%20here%21%20&amp;source=https%3A%2F%2Fgmu.az1.qualtrics.com%2Fjfe%2Fform%2FSV_cvDj3Vd3ZZvqAVT" target="_blank" rel="noopener" aria-label="LinkedIn">'
    let file = fs.readFileSync('views/index.ejs', 'ascii');
    let rendered = ejs.render(file, {data: data, persona: persona.name, desc: persona.desc, subPersonas: subPersonas, twitter: twitter, linkedin: linkedin, metrics: metrics});
    res.status(200).send(rendered);
  })
})
.catch(function(error) {
    console.error("Error adding document: ", error);
    res.status(500).send("Error adding document: ", error)
});

})

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

function getSubPersonas(debugTotals, implTotals, verifTotals) {
  var dCalc = debugTotals[4] + debugTotals[8]
  var dExpr = 0.66*(debugTotals[1] + debugTotals[2] + debugTotals[3])
  var dRes = 0.66*(debugTotals[5] + debugTotals[6] + debugTotals[7])

  var iCalc = implTotals[4] + implTotals[8]
  var iExpr = 0.66*(implTotals[1] + implTotals[2] + implTotals[3])
  var iRes = 0.66*(implTotals[5] + implTotals[6] + implTotals[7])

  var vCalc = verifTotals[4] + verifTotals[8]
  var vExpr = 0.66*(verifTotals[1] + verifTotals[2] + verifTotals[3])
  var vRes = 0.66*(verifTotals[5] + verifTotals[6] + verifTotals[7])

  var dPersona = getPersona(dCalc, dExpr, dRes)
  var iPersona = getPersona(iCalc, iExpr, iRes)
  var vPersona = getPersona(vCalc, vExpr, vRes)
  var subPersonas = {
    D_persona: dPersona,
    I_persona: iPersona,
    V_persona: vPersona
  }
  return subPersonas;
}

function updateMetrics(metrics, persona, subPersonas, calculated, experimental, resourceful, count) {
  if (persona.name == "Calculated") {
    metrics.numCalculated += 1
  } else if (persona.name == "Experimental") {
    metrics.numExperimental += 1
  } else if (persona.name == "Resourceful") {
    metrics.numResourceful += 1
  }
  if (subPersonas.D_persona.name == "Calculated") {
    metrics.numCalculated_D += 1
  } else if (subPersonas.D_persona.name == "Experimental") {
    metrics.numExperimental_D += 1
  } else if (subPersonas.D_persona.name == "Resourceful") {
    metrics.numResourceful_D += 1
  }
  if (subPersonas.I_persona.name == "Calculated") {
    metrics.numCalculated_I += 1
  } else if (subPersonas.I_persona.name == "Experimental") {
    metrics.numExperimental_I += 1
  } else if (subPersonas.I_persona.name == "Resourceful") {
    metrics.numResourceful_I += 1
  }
  if (subPersonas.V_persona.name == "Calculated") {
    metrics.numCalculated_V += 1
  } else if (subPersonas.V_persona.name == "Experimental") {
    metrics.numExperimental_V += 1
  } else if (subPersonas.V_persona.name == "Resourceful") {
    metrics.numResourceful_V += 1
  }
  return metrics;
}
