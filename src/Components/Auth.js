import firebase from '../../firebaseConfig';

export default class {
    constructor (dispatch) {
        this.dispatch = dispatch;

        this.watcher();
    }

    watcher () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("auth watcher -- user is logged in");
                this.setUserData(user);
            } 
            else {
                console.log("auth watcher -- user is NOT logged in");
                this.clearUserData();
            }
        });
    }

    setUserData (user) {
        this.dispatch({
            type: 'SET_USER_LOGGED_IN',
            payload: true
        });
        
        this.dispatch({
            type: 'SET_UID',
            payload: user.uid
        });
        
        firebase.firestore().collection("users").doc(user.uid).get()
        .then((docSnapshot) => {    
            if (docSnapshot.exists) {
                this.dispatch({
                    type: 'SET_USER_NOTEBOOKS',
                    payload: docSnapshot.data().notebooks
                });
            } 
            else {
                console.log('document NOT found');
            }          
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    clearUserData () {
        this.dispatch({
            type: 'USER_IS_LOGGED_IN',
            payload: false
        });
    }
}