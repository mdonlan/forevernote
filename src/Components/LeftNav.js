import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from "../../firebaseConfig";

const Wrapper = styled.div`
    height: 100%;
    width: 20%;
    background: #222222;
    display: flex;
    flex-direction: column;
    color: #dddddd;
`;

const NewNote = styled.div`
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #255429;

    :hover {
        background: #26822E;
    }
`;

const Split = styled.div`
    display: flex;
    height: 100%;
`;

const MidLine = styled.div`
    width: 2px;
    background: #111111;
`;

const Notebooks = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(50% - 1px);
`;

const Notebook = styled.div`
    padding: 5px;
    background: #234282;
    transition: 0.3s;
    cursor: pointer;
    margin-bottom: 3px;

    :hover {
        background: #2351B1;
    }
`;

const Notes = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(50% - 1px);
`;

const Note = styled.div`
    padding: 5px;
    background: #234282;
    transition: 0.3s;
    cursor: pointer;
    margin-bottom: 3px;

    :hover {
        background: #2351B1;
    }
`;

class LeftNav extends React.Component {

    setActiveNotebookHandler (i) {
        this.props.dispatch({
            type: "SET_ACTIVE_NOTEBOOK",
            payload: i
        });
    }
    
    setActiveNoteHandler (i) {

        // let notes = [...this.props.userNotes];
        // let activeNote = notes.find((n) => {return n.title == note.title});
        // activeNote.body = note.body;

        // this.props.dispatch({
        //     type: "SET_USER_NOTES",
        //     payload: notes
        // });

        // when we click on a new note we want to save the active note to firestore
        // before loading the new note
        // firebase.firestore().collection("users").doc(nextProps.uid).get()
        // .then((docSnapshot) => {    
        //     if (docSnapshot.exists) {
        //         let notes = docSnapshot.data().notes;
        //         let activeNote = notes.find((note) => {return note.title == this.props.activeNote.title});
                
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
        // console.log(this.props)
        // let notes = [...this.props.userNotes];
        // let activeNote = notes.find((n) => {return n.title == this.props.activeNote.title});
        // if (activeNote) {
        //     let notes = [...this.props.userNotes];
        //     let activeNote = notes.find((n) => {return n.title == this.props.activeNote.title});
        //     // activeNote.body = this.editor.body;

        //     this.props.dispatch({
        //         type: "SET_USER_NOTES",
        //         payload: notes
        //     });
        // }

        firebase.firestore().collection("users").doc(this.props.uid).get()
        .then((doc) => {    
            if (doc.exists) {
                this.props.dispatch({
                    type: 'SET_USER_NOTEBOOKS',
                    payload: doc.data().notebooks
                });
            } 
            else {
                console.log('document NOT found');
            }          
        })
        .catch((error) => {
            console.log(error);
        });

        this.props.dispatch({
            type: "SET_ACTIVE_NOTE",
            payload: i
        });
    }
    
    createNewNoteHandler = () => {
    }

    render () {
        return (
            <Wrapper>
                <NewNote onClick={this.createNewNoteHandler}>new note</NewNote>
                {this.props.userNotebooks.length > 0 &&
                    <Split>
                        <Notebooks>
                            {this.props.userNotebooks.map((notebook, i) => {
                                return (
                                    <Notebook key={notebook.name} onClick={() => {this.setActiveNotebookHandler(i)}} >{notebook.name}</Notebook>
                                )
                            })}
                        </Notebooks>
                        <MidLine />
                        <Notes>
                            {this.props.userNotebooks[this.props.activeNotebook].notes.map((note, i) => {
                                return (
                                    <Note key={note.id} onClick={() => {this.setActiveNoteHandler(i)}} >{note.title}</Note>
                                )
                            })}
                        </Notes>
                    </Split>
                }
            </Wrapper>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userNotebooks: state.userNotebooks,
        activeNote: state.activeNote,
        activeNotebook: state.activeNotebook,
        uid: state.uid
    };
};

export default connect(mapStateToProps)(LeftNav);

