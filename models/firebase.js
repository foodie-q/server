const firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')
require('dotenv').config()

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID
}

firebase.initializeApp(config)

const db = firebase.firestore()
const auth = firebase.auth()

module.exports = {
  db,
  auth
}