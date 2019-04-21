import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from '../../firebaseConfig';

const Wrapper = styled.div`
    height: 100%;
    width: 80%;
    background: #333333;
    color: #dddddd;
`;

const Editable = styled.div`
    height: calc(100% - 20px);
    width: calc(100% - 20px);
    padding: 10px;
    outline: 0px solid transparent;
`;

class Editor extends React.Component {

    state = {
        content: null, // entire content of the active note
        editableElem: React.createRef()
    }

    componentDidMount () {
        this.state.editableElem.current.focus();
        setInterval(() => {
            // this.save();
        }, 5000);
    }

    componentWillReceiveProps (nextProps) {
        this.update(nextProps);
    }

    update (nextProps) {
        // when we click a note in the leftNav menu it will give us a next activeNote prop
        // if we get a new active note we should check firebase for the most recent saved version of it
        // firebase.firestore().collection("users").doc(nextProps.uid).get()
        // .then((docSnapshot) => {    
        //     if (docSnapshot.exists) {
        //         let notes = docSnapshot.data().notes;
        //         let activeNote = notes.find((note) => {return note.title == this.props.userNotes[this.props.activeNote].title});
                

                
        //         this.props.dispatch({
        //             type: "SET_USER_NOTES",
        //             payload: notes
        //         });
        //     } else {
        //         console.log('document NOT found');
        //     }          
        // })
        // .catch((error) => {
        //     console.log(error);
        // })

        if (nextProps.activeNote != null && nextProps.userNotebooks.length > 0) {
            this.state.editableElem.current.innerHTML = nextProps.userNotebooks[nextProps.activeNotebook].notes[nextProps.activeNote].body;
        }
    }

    handleInput = (e) => {
        // this.setState({ content: e.target.innerHTML});

        // let note = {...this.props.activeNote};
        // note.body = e.target.innerHTML;
        // this.props.dispatch({
        //     type: "SET_ACTIVE_NOTE",
        //     payload: note
        // });
    }

    save (text, activeNote, activeNotebook) {

        // get user w/ uid
        // get active notebook
        // get active note
        // update

        firebase.firestore().collection("users").doc(this.props.uid).get()
        .then((doc) => {    
            if (doc.exists) {
                let notebooks = doc.data().notebooks;
                let note = notebooks[activeNotebook].notes[activeNote];
                if (note) {
                    note.body = text;
                    firebase.firestore().collection("users").doc(this.props.uid).update({
                        notebooks: notebooks
                    })
                    .then(function() {
                        console.log("Document successfully updated!");
                    });
                }
                else {
                    console.log("Failed to find active note.");
                }
            } 
            else {
                console.log('document NOT found');
            }          
        })
        .catch((error) => {
            console.log(error);
        })
    }

    handleBlur = (e) => {
        console.log("blur");

        // we need to capture this info here because of the event order
        // by the time we get to save the props have already bene changed and we would have the wrong data
        // about activeNote and such
        const text = this.state.editableElem.current.innerHTML;
        const activeNote = this.props.activeNote;
        const activeNotebook = this.props.activeNotebook;
        this.save(text, activeNote, activeNotebook);
    }

    render () {
        return (
            <Wrapper>
                <Editable ref={this.state.editableElem} contentEditable={true} onInput={this.handleInput} onBlur={this.handleBlur} autoFocus ></Editable>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeNote: state.activeNote,
        activeNotebook: state.activeNotebook,
        userNotebooks: state.userNotebooks,
        userNotes: state.userNotes,
        uid: state.uid
    };
};

export default connect(mapStateToProps)(Editor);

