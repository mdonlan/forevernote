import React from "react";
import styled from 'styled-components';

import firebase from '../../firebaseConfig';

const Wrapper = styled.div``;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Email = styled.input``;
const Password = styled.input``;
const Submit = styled.input``;

class Signup extends React.Component {

    state = {
        emailRef: React.createRef(),
        passwordRef: React.createRef()
    };

    handleSubmit = (e) => {
        e.preventDefault();
        
        let email = this.state.emailRef.current.value;
        let password = this.state.passwordRef.current.value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            firebase.firestore().collection("users").doc(user.user.uid).set({
                uid: user.user.uid,
                notes: [{title: "test note", body: "test body test body"}]
            })
            .then(function(docRef) {
                console.log('Collection created for user.')
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render () {
        return (
            <Wrapper>
                <div>SIGNUP</div>
                <Form onSubmit={this.handleSubmit}>
                    <Email ref={this.state.emailRef} placeholder="email" />
                    <Password ref={this.state.passwordRef} type="password" placeholder="password" />
                    <Password type="submit" value="Submit" />
                </Form>
            </Wrapper>
        );
    }
}

export default Signup;