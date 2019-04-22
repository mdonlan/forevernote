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
    height: calc(100% - 20px);
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

class Editor extends React.Component {

    state = {
        content: null, // entire content of the active note
        editableElem: React.createRef()
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
            this.state.editableElem.current.innerHTML = nextProps.userNotebooks[nextProps.activeNotebook].notes[nextProps.activeNote].body;
        }
    }

    handleBlur = (e) => {
        // we need to capture this info here because of the event order
        // by the time we get to save() the props have already bene changed and we would have the wrong data
        // about activeNote and such
        const text = this.state.editableElem.current.innerHTML;
        const activeNote = this.props.activeNote;
        const activeNotebook = this.props.activeNotebook;

        updateNotebooks(this.props.dispatch, this.props.uid, text, activeNote, activeNotebook);
    }

    render () {
        return (
            <Wrapper>
                <Editable ref={this.state.editableElem} contentEditable={true} onInput={this.handleInput} onBlur={this.handleBlur} autoFocus ></Editable>
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