import React from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Route, Switch, withRouter } from 'react-router-dom';

import { watchUserStatus } from '../../API';

import Signup from "./Signup";
import Login from "./Login";
import TopNav from './TopNav';
import Home from './Home';


const Wrapper = styled.div`
    height: 100%;
    width: 100%;
`;

class App extends React.Component {
    constructor (props) {
        super(props);
        watchUserStatus(this.props.dispatch); // start watching whether user is logged in or not
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