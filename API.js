import firebase from './firebaseConfig';

//
// all interactions with the firebase api will be in this file
//

export function watchUserStatus (dispatch) {
    // updates whenever the user login status changes in firebase
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("auth watcher -- user is logged in");
            dispatch({ type: 'SET_USER_LOGGED_IN', payload: true });
            dispatch({ type: 'SET_UID', payload: user.uid });
            loadUserNotebooks(dispatch, user.uid);
        } 
        else {
            console.log("auth watcher -- user is NOT logged in");
            dispatch({ type: 'USER_IS_LOGGED_IN', payload: false });
        }
    });
}

export function loadUserNotebooks (dispatch, uid) {
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            dispatch({ type: 'SET_USER_NOTEBOOKS', payload: doc.data().notebooks });
            dispatch({ type: "SET_LOADING_NOTE", payload: false });
        } 
        else console.log('document NOT found');     
    })
    .catch(error => console.log(error));
}

export function updateNotebooks (dispatch, uid, text, activeNote, activeNotebook) {
    // save to firebase
    // currently we are replaceing all the user notebook data
    // this is probably not efficient, and we should try to just replace the specific note
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let notebooks = doc.data().notebooks;
            let note = notebooks[activeNotebook].notes[activeNote];
            if (note) {
                note.body = text;
                firebase.firestore().collection("users").doc(uid).update({
                    notebooks: notebooks
                })
                .then(function() {
                    console.log("Document successfully updated!");
                });
            }
            else console.log("Failed to find active note.");
        } 
        else console.log('Failed to find document.');       
    })
    .catch(error => console.log(error));
}

export function createNewNote (uid, activeNotebook, newNote) {
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let notebooks = doc.data().notebooks;
            notebooks[activeNotebook].notes.push(newNote);
            firebase.firestore().collection("users").doc(uid).update({
                notebooks: notebooks
            })
            .then(function() {
                console.log("Document successfully updated!");
            });
        } 
        else console.log('Failed to find document.');       
    })
    .catch(error => console.log(error));
}

export function createNewNotebook (uid, newNotebook) {
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let notebooks = doc.data().notebooks;
            notebooks.push(newNotebook);
            firebase.firestore().collection("users").doc(uid).update({
                notebooks: notebooks
            })
            .then(function() {
                console.log("Document successfully updated!");
            });
        } 
        else console.log('Failed to find document.');       
    })
    .catch(error => console.log(error));
}