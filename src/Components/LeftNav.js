import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import shortid from 'shortid';
import { Scrollbars } from 'react-custom-scrollbars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { loadUserNotebooks, createNewNote, createNewNotebook, deleteNote } from '../../API';

const Wrapper = styled.div`
    height: 100%;
    width: 20%;
    background: #222222;
    display: flex;
    flex-direction: column;
    color: #dddddd;
    border-right: 2px solid #111111;
`;

const NewItemBtn = styled.div`
    height: 50px;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #255429;
    border-bottom: 1px solid #111111;
    transition: 0.3s;

    :hover {
        background: ${props => props.creating ? "#255429;" : "#26822E;"};
    }
`;

const NewItemForm = styled.form`
   height: 100%;
   width: 100%;
   display: flex;
   margin: 0px;
`;

const NewItemName = styled.input`
   height: 100%;
   width: 80%;
   background: none;
   border: none;
   outline: none;
   color: #ffffff;
   padding: 3px;
   text-align: center;
`;

const NewItemSubmit = styled.input`
    height: 100%;
    width: 10%;
    /* background: #14931A; */
    background: none;
    border: none;
    cursor: pointer;
    padding: 0px;
    margin: 0px;
    box-sizing: border-box;
    outline: none;
    transition: 0.3s;
    color: #dddddd;

    :hover {
        background: #18A71F;
    }
`;

const NewItemCancel = styled.div`
   height: 100%;
   width: 10%;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;

   transition: 0.3s;

    :hover {
        background: #F03333;
    }
`;

const EditBtn = styled.div`
    height: 50px;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #111111;
    border-bottom: 1px solid #111111;
    transition: 0.3s;

    :hover {
        background: #1E1E1E;
    }
`;

const SectionTitle = styled.div`
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;
    font-variant: small-caps;
`;

const UserNoteBooks = styled.div`
    display: flex;
    height: 100%;
    border-top: 2px solid #111111;
`;

const Notebooks = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(50% - 1px);
    border-right: 1px solid #111111;
`;

const Notebook = styled.div`
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;

    background: ${props => props.active == props.index ? "#2164F0" : "#234282"};

    :hover {
        background: #2351B1;
    }
`;

const Notes = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-left: 1px solid #111111;
`;

const Note = styled.div`
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    background: ${props => props.active == props.index ? "#2164F0" : "#234282"};

    :hover {
        background: #2351B1;
    }
`;

const NoteTitle = styled.div``;

const DeleteIcon = styled(FontAwesomeIcon)`
    transition: 0.3s;

    :hover {
        color: #CA4715;
    }
`;

class LeftNav extends React.Component {

    state = {
        creatingNewNotebook: false,
        creatingNewNote: false,
        newNotebookTitleElem: React.createRef(),
        newNoteTitleElem: React.createRef(),
        editMode: false
    }

    setActiveNotebookHandler (i) {
        this.props.dispatch({ type: "SET_ACTIVE_NOTEBOOK", payload: i });
        // when loading a new notebook also set the active note to 0
        this.props.dispatch({ type: "SET_ACTIVE_NOTE", payload: 0 });
        this.props.dispatch({ type: "SET_LOADING_NOTE", payload: true });

        loadUserNotebooks(this.props.dispatch, this.props.uid);
    }
    
    setActiveNoteHandler (i) {
        // when we click a new not load all notes from the server
        // this is not efficient, we can do this better
        this.props.dispatch({ type: "SET_ACTIVE_NOTE", payload: i });
        this.props.dispatch({ type: "SET_LOADING_NOTE", payload: true });

        loadUserNotebooks(this.props.dispatch, this.props.uid);
    }
    
    createNewNoteHandler = () => {
        if (!this.state.creatingNewNote) {
            this.setState({ creatingNewNote: true });
        }
    }

    createNewNotebookHandler = () => {
        if (!this.state.creatingNewNotebook) {
            this.setState({ creatingNewNotebook: true });
        }
    }

    handleSubmitNewNote = (e) => {
        e.preventDefault(); // prevent page reload 

        // create a new notebook and add it to the firebase notebooks
        const newNote = {
            title: this.state.newNoteTitleElem.current.value,
            body: "",
            id: shortid.generate(),
            versions: []
        };

        createNewNote(this.props.uid, this.props.dispatch, this.props.activeNotebook, newNote);

        this.setState({ creatingNewNote: false });
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
                <NewItemBtn creating={this.state.creatingNewNote} onClick={this.createNewNoteHandler}>
                    {!this.state.creatingNewNote &&
                        <div>New Note</div>
                    }
                    {this.state.creatingNewNote &&
                        <NewItemForm onSubmit={this.handleSubmitNewNote}>
                            <NewItemName ref={this.state.newNoteTitleElem} placeholder="Note Title"></NewItemName>
                            <NewItemSubmit type="submit" value="&#10004;"></NewItemSubmit>
                            <NewItemCancel onClick={() => {this.setState({ creatingNewNote: false })}}>&#10006;</NewItemCancel>
                        </NewItemForm>
                    }
                </NewItemBtn>

                <NewItemBtn creating={this.state.creatingNewNotebook} onClick={this.createNewNotebookHandler}>
                    {!this.state.creatingNewNotebook &&
                        <div>New Notebook</div>
                    }
                    {this.state.creatingNewNotebook &&
                        <NewItemForm onSubmit={this.handleSubmitNewNotebook}>
                            <NewItemName ref={this.state.newNotebookTitleElem} placeholder="Notebook Title"></NewItemName>
                            <NewItemSubmit type="submit" value="&#10004;"></NewItemSubmit>
                            <NewItemCancel onClick={() => {this.setState({ creatingNewNotebook: false })}}>&#10006;</NewItemCancel>
                        </NewItemForm>
                    }
                </NewItemBtn>

                <EditBtn onClick={() => {this.state.editMode ? this.setState({ editMode: false }) : this.setState({ editMode: true })}}>Edit</EditBtn>

                {this.props.userNotebooks.length > 0 &&
                    <UserNoteBooks>
                        <Notebooks>
                            <SectionTitle>Notebooks</SectionTitle>
                            {this.props.userNotebooks.map((notebook, i) => {
                                return (
                                    <Notebook active={this.props.activeNotebook} index={i}  key={notebook.name} onClick={() => {this.setActiveNotebookHandler(i)}} >{notebook.name}</Notebook>
                                )
                            })}
                        </Notebooks>
                        <Scrollbars style={{ width: "50%", height: "100%" }}>
                            <Notes>
                                <SectionTitle>Notes</SectionTitle>
                                {this.props.userNotebooks[this.props.activeNotebook].notes.map((note, i) => {
                                    return (
                                        <Note active={this.props.activeNote} index={i} key={note.id} onClick={() => {this.setActiveNoteHandler(i)}} >
                                            <NoteTitle>{note.title}</NoteTitle>
                                            {this.state.editMode &&
                                                <DeleteIcon icon={faTimesCircle} onClick={(e) => {e.stopPropagation(); deleteNote(this.props.uid, this.props.dispatch, this.props.activeNotebook, i)}}></DeleteIcon>
                                            }
                                        </Note>
                                    )
                                })}
                            </Notes>
                        </Scrollbars>
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