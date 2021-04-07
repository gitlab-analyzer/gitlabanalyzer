import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import AnonymousViewing from '../components/config/AnonymousViewing';
import FooterBar from '../components/FooterBar';
import {Form, Divider, Row, Col, Button, Input, Modal, notification} from 'antd';
import { useAuth } from '../context/AuthContext'
import moment from 'moment';
import {CheckCircleOutlined} from "@ant-design/icons";

let SavedConfigs = {}
const ConfigPage = () => {
  const { 
    dataList,
    setDataList,
    currentConfig,
    setCurrentConfig
  } = useAuth();
  const [form] = Form.useForm();

  const handleSave = (value) => {
    SavedConfigs[value.configname] = value;
    setCurrentConfig(value);
    console.log(currentConfig)
    setDataList(value.date);
  }

  const fillForm = () => {
    console.log("Add Saved Config", SavedConfigs["1"])
    form.setFieldsValue(
        // SavedConfigs["1"],
        {date: [moment().startOf("month"), moment().endOf("month")]}
    );
  };
  const saveSuccessful = () => {
    console.log('in save config', currentConfig)
    console.log(typeof currentConfig.configname)
    notification.open({

      message: 'Saved Config',
      icon: <CheckCircleOutlined style={{ color: '#00d100' }} />,
      duration: 1.5,
    });
  };
  useEffect(() => {
    // form.setFieldsValue({date:{dataList}})
    console.log(dataList);
  }, [dataList]);
  return (
    <>
      <Header />
      <Form 
        style={{ padding:'3% 3% 0 3%' }}
        onFinish={handleSave}
        form={form}
      >
        <Button
          onClick={fillForm}
        >
          Fill Form
        </Button>
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
          <div className="buttonContainer" style={{ display:'flex' }}>
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
              onClick={saveSuccessful}
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
