import React from "react";
import styled from 'styled-components';

import Editor from "./Editor";
import LeftNav from "./LeftNav";

const Wrapper = styled.div`
    display: flex;
    height: calc(100% - 50px); /* 50px for topnav height */
`;

class Home extends React.Component {
    render () {
        return (
            <Wrapper>
                <LeftNav />
                <Editor />
            </Wrapper>
        );
    }
}

export default Home;