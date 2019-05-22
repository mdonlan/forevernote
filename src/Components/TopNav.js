import React from "react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
    width: 100%;
    height: 50px;
    background: #222222;
    display: flex;
    border-bottom: 2px solid #111111;
`;

const StyledLink = styled(Link)`
    color: #dddddd;
    text-decoration: none;
    padding: 10px;
    width: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;

    :hover {
        background: #dddddd;
        color: #222222;
    }
`;

class TopNav extends React.Component {
    render () {
        return (
            <Wrapper>
                <StyledLink to="/">Home</StyledLink>
                <StyledLink to="/login">Login</StyledLink>
                <StyledLink to="/signup">Signup</StyledLink>
            </Wrapper>
        );
    }
}

export default TopNav;
