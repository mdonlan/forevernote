import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import shortid from 'shortid';

import { loadUserNotebooks, createNewNote, createNewNotebook } from '../../API';

const Wrapper = styled.div`
    height: 100%;
    width: 20%;
    background: #222222;
    display: flex;
    flex-direction: column;
    color: #dddddd;
`;

const NewNoteBtn = styled.div`
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

const NewNotebookBtn = styled.div`
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

const NewNotebookForm = styled.form`
   
`;

const NewNotebookName = styled.input`
   
`;

const NewNotebookSubmit = styled.input`
   
`;

const NewNoteForm = styled.form`
   
`;

const NewNoteName = styled.input`
   
`;

const NewNoteSubmit = styled.input`
   
`;

const UserNoteBooks = styled.div`
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
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;

    background: ${props => props.activeNotebook == props.index ? "#2164F0" : "#234282"};

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
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;

    background: ${props => props.activeNote == props.index ? "#2164F0" : "#234282"};

    :hover {
        background: #2351B1;
    }
`;

class LeftNav extends React.Component {

    state = {
        creatingNewNotebook: false,
        creatingNewNote: false,
        newNotebookTitleElem: React.createRef(),
        newNoteTitleElem: React.createRef()
    }

    setActiveNotebookHandler (i) {
        this.props.dispatch({ type: "SET_ACTIVE_NOTEBOOK", payload: i });
    }
    
    setActiveNoteHandler (i) {
        // when we click a new not load all notes from the server
        // this is not efficient, we can do this better
        this.props.dispatch({ type: "SET_ACTIVE_NOTE", payload: i });
        this.props.dispatch({ type: "SET_LOADING_NOTE", payload: true });

        loadUserNotebooks(this.props.dispatch, this.props.uid);
    }
    
    createNewNoteHandler = () => {
        this.setState({ creatingNewNote: true });
    }

    createNewNotebookHandler = () => {
        this.setState({ creatingNewNotebook: true });
    }

    handleSubmitNewNote = (e) => {
        e.preventDefault(); // prevent page reload 

        // create a new notebook and add it to the firebase notebooks
        const newNote = {
            title: this.state.newNoteTitleElem.current.value,
            body: "",
            id: shortid.generate()
        };

        createNewNote(this.props.uid, this.props.activeNotebook, newNote);
    }

    handleSubmitNewNotebook = (e) => {
        e.preventDefault(); // prevent page reload 

        // create a new notebook and add it to the firebase notebooks
        const newNotebook = {
            name: this.state.newNotebookTitleElem.current.value,
            notes: []
        };

        createNewNotebook(this.props.uid, newNotebook);
    }

    render () {
        return (
            <Wrapper>
                <NewNoteBtn onClick={this.createNewNoteHandler}>New Note</NewNoteBtn>
                <NewNotebookBtn onClick={this.createNewNotebookHandler}>New Notebook</NewNotebookBtn>
                
                {this.state.creatingNewNotebook &&
                    <NewNotebookForm onSubmit={this.handleSubmitNewNotebook}>
                        <NewNotebookName ref={this.state.newNotebookTitleElem} placeholder="Notebook Title"></NewNotebookName>
                        <NewNotebookSubmit type="submit" value="Submit"></NewNotebookSubmit>
                    </NewNotebookForm>
                }

                {this.state.creatingNewNote &&
                    <NewNotebookForm onSubmit={this.handleSubmitNewNote}>
                        <NewNotebookName ref={this.state.newNoteTitleElem} placeholder="Notebook Title"></NewNotebookName>
                        <NewNotebookSubmit type="submit" value="Submit"></NewNotebookSubmit>
                    </NewNotebookForm>
                }

                {this.props.userNotebooks.length > 0 &&
                    <UserNoteBooks>
                        <Notebooks>
                            {this.props.userNotebooks.map((notebook, i) => {
                                return (
                                    <Notebook activeNotebook={this.props.activeNotebook} index={i}  key={notebook.name} onClick={() => {this.setActiveNotebookHandler(i)}} >{notebook.name}</Notebook>
                                )
                            })}
                        </Notebooks>
                        <MidLine />
                        <Notes>
                            {this.props.userNotebooks[this.props.activeNotebook].notes.map((note, i) => {
                                return (
                                    <Note activeNote={this.props.activeNote} index={i} key={note.id} onClick={() => {this.setActiveNoteHandler(i)}} >{note.title}</Note>
                                )
                            })}
                        </Notes>
                    </UserNoteBooks>
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