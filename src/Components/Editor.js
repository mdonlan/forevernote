import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'

import { updateNotebooks } from '../../API';

const Wrapper = styled.div`
    height: 100%;
    width: 80%;
    background: #333333;
    color: #dddddd;
    position: relative;
`;

const Editable = styled.div`
    height: ${props => props.viewingVersions ? "calc(100% - 82px);" : "calc(100% - 52px);"};
    width: calc(100% - 20px);
    padding: 10px;
    outline: 0px solid transparent;
`;

const OldVersion = styled.div`
    position: absolute;
    top: 62px;
    height: calc(100% - 82px);
    width: calc(100% - 20px);
    padding: 10px;
    background: #333333;
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

const VersionSelection = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #B78513;
    height: 30px;
`;

const SelectionLeft = styled.div``;
const SelectionRight = styled.div`
    display: flex;
`;

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
            console.log(this.props.activeNote);
            if (nextProps.userNotebooks[nextProps.activeNotebook].notes.length > 0) {
                console.log(nextProps.userNotebooks[nextProps.activeNotebook].notes[nextProps.activeNote]);
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
            if (this.state.onVersion < numVersions) {
                this.setState({ onVersion: this.state.onVersion + 1});
           }
        }
        else {
            if (this.state.onVersion > 0) {
                this.setState({ onVersion: this.state.onVersion - 1});
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
                            <ViewVersionsBtn onClick={() => {this.setState({ viewingOldVersions: this.state.viewingOldVersions ? false : true, onVersion: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions.length})}}>Versions</ViewVersionsBtn>
                        </Versions>
                    } 
                </EditorTop>
                {this.state.viewingOldVersions && 
                    <VersionSelection>
                        <SelectionLeft>
                            <ViewingVersionsNotification>Viewing Versions</ViewingVersionsNotification>
                        </SelectionLeft>
                        <SelectionRight>
                            <div>Version: {this.state.onVersion + 1}</div>
                            <PrevVersion onClick={() => {this.handleVersion(-1)}}>
                                <FontAwesomeIcon icon={faArrowCircleLeft} />
                            </PrevVersion>
                            <NextVersion onClick={() => {this.handleVersion(1)}}>
                                <FontAwesomeIcon icon={faArrowCircleRight} />
                            </NextVersion>
                        </SelectionRight>
                    </VersionSelection>
                }
                <Editable viewingVersions={this.state.viewingOldVersions} ref={this.state.editableElem} contentEditable={true} onBlur={this.handleBlur} autoFocus ></Editable>
                {this.state.viewingOldVersions && this.state.onVersion < this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions.length &&
                    <OldVersion dangerouslySetInnerHTML={{__html: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions[this.state.onVersion].body}} />
                }
                {this.state.viewingOldVersions && this.state.onVersion == this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].versions.length &&
                    <OldVersion dangerouslySetInnerHTML={{__html: this.props.userNotebooks[this.props.activeNotebook].notes[this.props.activeNote].body}} />
                }
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