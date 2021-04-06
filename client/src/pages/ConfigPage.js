import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import AnonymousViewing from '../components/config/AnonymousViewing';
import FooterBar from '../components/FooterBar';
import { Form, Divider, Row, Col, Button, Input, Modal } from 'antd';
import { useAuth } from '../context/AuthContext'

let SavedConfigs = {}
const ConfigPage = () => {
  const { 
    dataList,
    setDataList,
    currentConfig,
    setCurrentConfig
  } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({date:{dataList}})
   }, [form, dataList])

  const handleSave = (value) => {
    SavedConfigs[value.configname] = value;
    setCurrentConfig({value});
    console.log("current config", currentConfig)
    setDataList(value.date)
  }

  const fillForm = () => {
    form.setFieldsValue(
        SavedConfigs["1"],
    );
  };
  return (
    <>
      <Header />
      <Form 
        style={{ padding:'3% 3% 0 3%'}}
        onFinish={handleSave}
      >
        <InitialUserDates />
        <Divider />
        <Row gutter={120}>
          <Col>
            <IterationDates />
          </Col>
          <Col>
            <LanguagePoints />
          </Col>
        </Row>
        <Divider />
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"end"}}>
          <AnonymousViewing />
          <div className="buttonContainer" style={{display:'flex'}}>
            <Form.Item
              name="configname"
              rules={[
                {
                  required: true,
                  message: 'Please input a name.',
                },
              ]}
            >
              <Input 
                style={{marginRight:100}}
                size="large"
                />
            </Form.Item>
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
