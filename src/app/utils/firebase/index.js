import FirebaseDB from './firebase-database';
import FirebaseAuth from './firebase-auth';
import FirebaseStorage from './firebase-storage';
const app = require('firebase/app');
const config = require('./firebase-config.json');
require('firebase/auth');
require('firebase/database');
require('firebase/storage');

class Firebase {

    constructor() {
        if (Firebase.instance) {
            throw new Error("You can't create object. Use Firebase.getInstance()");
        }
    }

    static getInstance() {
        if (!Firebase.instance) {
            app.initializeApp(config);
            Firebase.instance = new Firebase();
            Firebase.app = app;
        }
        return Firebase.instance;
    }

    getFirebaseApp() {
        return Firebase.app;
    }

    getAuth() {
        if (!Firebase.auth) {
            Firebase.auth = new FirebaseAuth(Firebase.app.auth());
        }
        return Firebase.auth;
    }

    getDB() {
        if (!Firebase.database) {
            Firebase.database = new FirebaseDB(Firebase.app.database());
        }
        return Firebase.database;
    }

    getStorage() {
        if (!Firebase.storage) {
            Firebase.storage = new FirebaseStorage(Firebase.app.storage());
        }
        return Firebase.storage;
    }
}

export default Firebase;
