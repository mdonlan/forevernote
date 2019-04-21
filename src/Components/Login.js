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

class Login extends React.Component {

    state = {
        emailRef: React.createRef(),
        passwordRef: React.createRef()
    };

    handleSubmit = (e) => {
        event.preventDefault();

        let email = this.state.emailRef.current.value;
        let password = this.state.passwordRef.current.value;

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((response) => {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    render () {
        return (
            <Wrapper>
                <div>LOGIN</div>
                <Form onSubmit={this.handleSubmit}>
                    <Email ref={this.state.emailRef} placeholder="email" />
                    <Password ref={this.state.passwordRef} type="password" placeholder="password" />
                    <Password type="submit" value="Submit" />
                </Form>
            </Wrapper>
        );
    }
}

export default Login;