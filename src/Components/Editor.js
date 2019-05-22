import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import { updateNotebooks } from '../../API';

const Wrapper = styled.div`
    height: 100%;
    width: 80%;
    background: #333333;
    color: #dddddd;
    position: relative;
`;

const Editable = styled.div`
    height: calc(100% - 52px);
    width: calc(100% - 20px);
    padding: 10px;
    outline: 0px solid transparent;
`;

// the loading container blocks the note view while the new note is being retrieved from the server
// the prevents the user from seeing the old version of the note for a bit before we get it from the server
const LoadingContainer = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 2;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333333;
`;

const EditorTop = styled.div`
    height: 30px;
    width: 100%;
    display: flex;
    border-bottom: 2px solid #111111;
`;

const Styles = styled.div`
    display: flex;
    width: 25%;
    height: 100%;
`;

const Title = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Versions = styled.div`
    display: flex;
`;

const Version = styled.div``;
const ViewVersionsBtn = styled.div``;
const PrevVersion = styled.div``;
const NextVersion = styled.div``;
const ViewingVersionsNotification = styled.div``;

const Button = styled.div`
    height: 100%;
    width: 30px;
    background: #222222;
    cursor: pointer;
    transition: 0.3s;
    border-right: 2px solid #111111;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        background: #333333;
    }
`;

class Editor extends React.Component {

    state = {
        // content: null, // entire content of the active note
        title: null,
        editableElem: React.createRef(),
        viewingOldVersions: false,
        onVersion: null
    }

    componentDidMount () {
        this.state.editableElem.current.focus();

        // start autosave loop
        setInterval(() => {
            // this.save();
        }, 5000);
    }

    componentWillReceiveProps (nextProps) {
        // update activeNote
        if (nextProps.activeNote != null && nextProps.userNotebooks.length > 0) {
            // check if there are any notes in the active notebook
            // if note render a create a new note button
            if (nextProps.userNotebooks[nextProps.activeNotebook].notes.length > 0) {
                this.state.editableElem.current.innerHTML = nextProps.userNotebooks[nextProps.activeNotebook].notes[nextProps.activeNote].body;
                this.setState({ title: nextProps.userNotebooks[nextProps.activeNotebook].notes[nextProps.activeNote].title });
            } else {
                this.state.editableElem.current.innerHTML = "";
            }
        }
    }

    handleBlur = (e) => {
        // when the user clicks out of the note save the note

        // we need to capture this info here because of the event order
        // by the time we get to save() the props have already bene changed and we would have the wrong data
        // about activeNote and such
        const text = this.state.editableElem.current.innerHTML;
        const activeNote = this.props.activeNote;
        const activeNotebook = this.props.activeNotebook;

        // don't check unless we have a user id
        if (this.props.uid) {
            updateNotebooks(this.props.dispatch, this.props.uid, text, activeNote, activeNotebook);
        }
    }

    doCommand (command) {

        switch (command) {
            case "bold": {
                document.execCommand('bold');
                break;
            }
            case "italic": {
                document.execCommand('italic');
                break;
            }
            default: break;
        }
    }

    handleVersion (dir) {
        let numVersions = this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions.length;
        if (dir == 1) {
            console.log('up');
            if (this.state.onVersion < numVersions) {
                this.setState({ onVersion: this.state.onVersion + 1}, () => {
                    if (this.state.onVersion == numVersions) {
                        this.state.editableElem.current.innerHTML = this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].body;
                        this.setState({ title: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].title });
                    } else {
                        this.state.editableElem.current.innerHTML = this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions[this.state.onVersion].body;
                        this.setState({ title: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions[this.state.onVersion].title });
                    }
                });
            }
        }
        else {
            console.log('down');
            if (this.state.onVersion > 0) {
                this.setState({ onVersion: this.state.onVersion - 1}, () => {
                    this.state.editableElem.current.innerHTML = this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions[this.state.onVersion].body;
                    this.setState({ title: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions[this.state.onVersion].title });
                });
            }
        }
    }

    render () {
        return (
            <Wrapper>
                <EditorTop>
                    <Styles>
                        <Button onMouseDown={() => {event.preventDefault();}} onClick={() => {this.doCommand("bold");}}>B</Button>
                        <Button onMouseDown={() => {event.preventDefault();}} onClick={() => {this.doCommand("italic");}}>I</Button>
                    </Styles>
                    {this.state.title &&
                        <Title>{this.state.title}</Title>
                    }
                    {this.props.userNotebooks[this.props.activeNotebook] &&
                        <Versions>
                            <Version>
                                Version # 
                                {this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote] &&
                                    this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions.length + 1
                                }
                            </Version>
                            <ViewVersionsBtn onClick={() => {this.setState({ viewingOldVersions: true, onVersion: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions.length})}}>View Versions</ViewVersionsBtn>
                            {this.state.viewingOldVersions &&
                                <React.Fragment>
                                    <PrevVersion onClick={() => {this.handleVersion(-1)}}>&lt;</PrevVersion>
                                    <NextVersion onClick={() => {this.handleVersion(1)}}>&gt;</NextVersion>
                                </React.Fragment>
                            }
                        </Versions>
                    } 
                </EditorTop>
                {this.state.viewingOldVersions && 
                    <React.Fragment>
                        <ViewingVersionsNotification>Viewing Versions</ViewingVersionsNotification>
                        <div>{this.state.onVersion + 1}</div>
                    </React.Fragment>
                }
                <Editable ref={this.state.editableElem} contentEditable={true} onBlur={this.handleBlur} autoFocus ></Editable>
                {this.props.isLoadingNote &&
                    <LoadingContainer></LoadingContainer>
                }
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
        uid: state.uid,
        isLoadingNote: state.isLoadingNote
    };
};

export default connect(mapStateToProps)(Editor);