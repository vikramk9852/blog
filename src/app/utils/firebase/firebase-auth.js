
class FirebaseAuth {

    constructor(auth) {
        FirebaseAuth.auth = auth;
    }
    // *** Auth API ***
    signIn = (email, password) => {
        return FirebaseAuth.auth.createUserWithEmailAndPassword(email, password);
    }
    logIn = (email, password) => {
        return FirebaseAuth.auth.signInWithEmailAndPassword(email, password);
    }
    logOut = () => {
        return FirebaseAuth.auth.signOut();
    }
    resetPassword = email => {
        return FirebaseAuth.auth.sendPasswordResetEmail(email);
    }
    updatePassword = password => {
        return FirebaseAuth.auth.currentUser.updatePassword(password);
    }
    getCurrentUser = () => {
        return FirebaseAuth.auth.currentUser;
    }
    checkStatus = (callback) => {
        return FirebaseAuth.auth.onAuthStateChanged(callback);
    }
}

export default FirebaseAuth;