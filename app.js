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

  db.collection("responses").add({
    data: data
  })
.then(function(docRef) {
  var str = "";
  var respRef = db.collection("responses").limit(50);
  respRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        str = str.concat(`${doc.id} => ${JSON.stringify(doc.data().data)} \n`);
    });
    console.log("Get success: ", str);
    res.render('index', {data: data, str: str});
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
