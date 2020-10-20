import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import 'normalize.css';
import styled from 'styled-components';
import GlobalStyles from '../styles/GlobalStyles';
import Typography from '../styles/Typography';
import stripes from '../assets/images/stripes.svg';

const SiteBorderStyles = styled.div`
    max-width: 1000px;
    margin: 12rem auto 4rem auto;
    margin-top: clamp(2rem, 10vw, 12rem);
    background: white url(${stripes});
    background-size: 1500px;
    padding: 5px;
    padding: clamp(5px, 1vw, 25px);
    box-shadow: 00 5px 3px rgba(0, 0, 0, 0.044);
    border: 5px solid white;
    @media(max-width: 1100px) {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
    }
`;

const ContentStyles = styled.div`
    background: white;
    padding: 2rem;
`;

const Layout = ({children}) => {
    return (
        <div>
            <GlobalStyles />
            <Typography/>
            <SiteBorderStyles>
                <ContentStyles>
                    <Nav/>
                    {children}
                    <Footer/>
                </ContentStyles>
            </SiteBorderStyles>
        </div>
    )
};

export default Layout;