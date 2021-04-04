import React from 'react';
import Header from '../components/Header';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import AnonymousViewing from '../components/config/AnonymousViewing';
import FooterBar from '../components/FooterBar';
import { Form, Divider, Row, Col, Button } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';

const ConfigPage = () => {
  // const [form] = Form.useForm();
  const findValues = (value) => {
    console.log("from form", value)
  }
  return (
    <>
      <Header />
      <Form 
        style={{ padding:'3% 0 0 5%'}}
        onFinish={findValues}
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
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end"}}>
          <AnonymousViewing />
          <div className="buttonContainer">
            <Button 
              size="large" 
              style={{marginRight:10}}
            >
              Load Config
            </Button>
            <Button 
              htmlType="submit" 
              size="large" 
              type="primary"
            >
              Save As
            </Button>
          </div>

        </div>
      </Form>         
      <FooterBar />
    </>
  );
};

export default ConfigPage;


