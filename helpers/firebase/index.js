const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
require('firebase/database');
require('firebase/storage');
require('dotenv').config()

const config = {
  apiKey: "AIzaSyCmko1vka8wbPXEKS39mhMZyfJqDWrkGlo",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: "final-project-anton-zul-felix",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

const db = firebase.firestore();

module.exports.db = db;

module.exports.dbUsers = db.collection('users');
module.exports.dbMenus = db.collection('menus');
module.exports.dbOrders = db.collection('orders');
module.exports.dbSaldo = db.collection('saldo');

module.exports.auth = firebase.auth();

module.exports.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
module.exports.githubAuthProvider = new firebase.auth.GithubAuthProvider();
module.exports.facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

module.exports.storage = firebase.storage();
