var express = require('express');
var app = express();

var d3 = require("d3");

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyA7QXDAjJhGlmh2SGOprMAVlOtVBy_2RQo',
  authDomain: 'contextualfactors-22ef7.firebaseapp.com',
  projectId: 'contextualfactors-22ef7'
});

var db = firebase.firestore();

// let pShell = require('python-shell');
function call_results(req, res) {
  var options = {
    args:
    [
    ]
  }
  //
  // let dm = req.query.dm;
  // let im = req.query.im;
  // // let vm = req.query.vm;
  // //
  // // let if = req.query.if;
  // // let vf = req.query.vf;
  // // let df = req.query.df;
  // //
  // // let vc = req.query.vc;
  // // let dc = req.query.dc;
  // // let ic = req.query.ic;
  // //
  // let total_score1 = req.query.total1;
  // let total_score2 = req.query.total2;
  // let total_score3 = req.query.total3;
  // let total_score4 = req.query.total4;
  // let total_score5 = req.query.total5;
  // let total_score6 = req.query.total6;
  // let total_score7 = req.query.total7;
  // let total_score8 = req.query.total8;

  // fnd the max of dm, im, resuts_data_fetch
  // maybe i should store all of the values in the db?


  res.send(req.query);
//   db.collection("responses").add({
//     dm: req.query.dm,
//     im: req.query.im,
// //     vm: req.query.vm,
// //     if: req.query.if,
// //     vf: req.query.vf,
// //     df: req.query.df,
// //     vc: req.query.vc,
// //     dc: req.query.dc,
// //     ic: req.query.ic,
//     ts1: req.query.total_score1,
//     ts2: req.query.total_score2,
//     ts3: req.query.total_score3,
//     ts4: req.query.total_score4,
//     ts5: req.query.total_score5,
//     ts6: req.query.total_score6,
//     ts7: req.query.total_score7,
//     ts8: req.query.total_score8
// })


  db.collection("responses").add({
    dm: req.query.dm,
    im: req.query.im,
    vm: req.query.vm,
    if: req.query.if,
    vf: req.query.vf,
    df: req.query.df,
    vc: req.query.vc,
    dc: req.query.dc,
    ic: req.query.ic,
    ts1: req.query.total1,
    ts2: req.query.total2,
    ts3: req.query.total3,
    ts4: req.query.total4,
    ts5: req.query.total5,
    ts6: req.query.total6,
    ts7: req.query.total7,
    ts8: req.query.total8

  })
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

  // res.send(req.query.dm);
  // res.send('Hello World!');
  // pShell.PythonShell.run('./resuts_data_fetch.py', options, function (err, data) {
  //   if (err) res.send(err);
  //   res.send(data.toString())
  // });
}
app.get('/results', call_results);
// function call_results(req, res) {
//   var options = {
//     args:
//     [
//     ]
//   }
//   res.send('Hello World!');
//   // pShell.PythonShell.run('./resuts_data_fetch.py', options, function (err, data) {
//   //   if (err) res.send(err);
//   //   res.send(data.toString())
//   // });
// }

app.listen(3000, function () {
  console.log('server running on port 3000');
})
