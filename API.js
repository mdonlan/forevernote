import firebase from './firebaseConfig';
import store from './src/Redux/Store';

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

export function loadUserNotebooks (dispatch, uid, setActiveNote) {
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            dispatch({ type: 'SET_USER_NOTEBOOKS', payload: doc.data().notebooks });
            dispatch({ type: "SET_LOADING_NOTE", payload: false });

            // if we are coming from createNewNote then we need to set the newest note as the active note
            if (setActiveNote) {
                const state = store.getState();
                const activeNote = state.userNotebooks[state.activeNotebook].notes.length - 1;
                dispatch({ type: "SET_ACTIVE_NOTE", payload: activeNote });
            }
        } 
        else console.log('document NOT found');     
    })
    .catch(error => console.log(error));
}

export function updateNotebooks (dispatch, uid, text, activeNote, activeNotebook) {
    console.log('saving note');
    // save to firebase
    // currently we are replaceing all the user notebook data
    // this is probably not efficient, and we should try to just replace the specific note
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let notebooks = doc.data().notebooks;
            let note = notebooks[activeNotebook].notes[activeNote];

            // diff note text
            if (note.body == text) {
                console.log('note did not change, skipping save...');
                return;
            }

            let oldNoteVersion = {
                title: note.title,
                body: note.body,
                id: note.id
            };
            note.versions.push(oldNoteVersion); // save old body text in versions
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

export function createNewNote (uid, dispatch, activeNotebook, newNote) {
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let notebooks = doc.data().notebooks;
            notebooks[activeNotebook].notes.push(newNote);
            firebase.firestore().collection("users").doc(uid).update({
                notebooks: notebooks
            })
            .then(function() {
                console.log("Note added successfully!");
                loadUserNotebooks(dispatch, uid, true);
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

export function deleteNote (uid, dispatch, activeNotebook, activeNote) {
    createNewDeletedNote(uid, activeNotebook, activeNote);
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let notebooks = doc.data().notebooks;
            let notebook = notebooks[activeNotebook];
            notebook.notes.splice(activeNote, 1);
            firebase.firestore().collection("users").doc(uid).update({
                notebooks: notebooks
            })
            .then(function() {
                console.log("Document successfully updated!");
                loadUserNotebooks(dispatch, uid);
            });
        } 
        else console.log('Failed to find document.');       
    })
    .catch(error => console.log(error));
}

export function createNewDeletedNote (uid, activeNotebook, activeNote) {
    const state = store.getState();
    const note = state.userNotebooks[activeNotebook].notes[activeNote];
    firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {    
        if (doc.exists) {
            let deletedNotes = doc.data().deletedNotes;
            deletedNotes.push(note);
            firebase.firestore().collection("users").doc(uid).update({
                deletedNotes: deletedNotes
            })
            .then(function() {
                // console.log("Note added successfully!");
                // loadUserNotebooks(dispatch, uid, true);
            });
        } 
        else console.log('Failed to find document.');       
    })
    .catch(error => console.log(error));
}