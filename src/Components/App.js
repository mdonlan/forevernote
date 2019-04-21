import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Route, Switch, withRouter } from 'react-router-dom';

import Signup from "./Signup";
import Login from "./Login";
import TopNav from './TopNav';
import Home from './Home';

import Auth from "./Auth";

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

class App extends React.Component {
    constructor (props) {
        super(props);

        this.auth = new Auth(this.props.dispatch);
    }

    render () {
        return (
            <Wrapper>
                <TopNav />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                </Switch>
            </Wrapper>
        );
    }
}

export default withRouter(connect(null)(App));