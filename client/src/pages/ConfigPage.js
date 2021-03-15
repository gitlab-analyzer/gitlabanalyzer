import React from 'react';
import Header from '../components/Header';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import AnonymousViewing from '../components/config/AnonymousViewing';
import FooterBar from '../components/FooterBar';
import { Form, Divider, Row, Col } from 'antd';

const ConfigPage = () => {
  return (
    <>
      <Header />
      <Form 
        style={{ padding:'3% 0 0 5%', paddingBottom:0}}
      >
        <h6>User Details</h6>
        <InitialUserDates />
        <Divider />
        <Row gutter={100}>
          <Col>
            <IterationDates />
          </Col>
          <Col>
            <LanguagePoints />
          </Col>
        </Row>
        <Divider />
        <AnonymousViewing />
      </Form>         
      <FooterBar />
    </>
  );
};

export default ConfigPage;


