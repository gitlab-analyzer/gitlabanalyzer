import React, { useEffect } from 'react';
import Header from '../components/Header';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import FooterBar from '../components/FooterBar';
import {Form, Divider, Row, Col, Button, Input, notification, Select, Switch} from 'antd';
import { useAuth } from '../context/AuthContext'
import {SaveOutlined} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
export var SavedConfigs = {};

const ConfigPage = () => {
  const { 
    dataList,
    setDataList,
    currentConfig,
    setCurrentConfig,
    anon,
    setAnon
  } = useAuth();
  const [form] = Form.useForm();

  const fetchErrorChecker = (res, dataType) => {
    if (!res) {
      console.log(`Failed to retrieve ${dataType} list!`);
      throw new Error('Fetch request failed.');
    }
  };

  useEffect(() => {
    form.setFieldsValue(
        currentConfig
    );
  }, []);

  const handleSave = (value) => {
    const sendSave = async () => {
      let configDict ={}
      configDict["name"] = value.configname;
      configDict["value"] = value;
      let currConfig = JSON.stringify({
        configDict
      });
      const configStatus = await axios.post(
        `http://localhost:5678/config`,
        currConfig,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          crossorigin: true,
          crossDomain: true,
        }
      );
      fetchErrorChecker(configStatus.data['response'], 'config');
    }
    // SavedConfigs[value.configname] = value;
    setCurrentConfig(value);
    setDataList(value.date);

      notification.open({
        message: 'Saved Config',
        icon: <SaveOutlined style={{ color: '#00d100' }} />,
        duration: 1.5,
    });
  }

  const fillForm = (value) => {
    const retrieveConfig = async () => {
      SavedConfigs = await axios.get(
        `http://localhost:5678/config`,
        {
          withCredentials: true,
        }
      );
    }

    setCurrentConfig(SavedConfigs[value]);
    setDataList(SavedConfigs[value].date);
    setAnon(SavedConfigs[value].anon)
    form.setFieldsValue(
      SavedConfigs[value]
    );
  };

  return (
    <>
      <Header />
      <Form 
        style={{ padding:'3% 3% 0 3%' }}
        onFinish={handleSave}
        form={form}
      >
        <Select
          style={{
            width:429,
            display:"flex",
            marginRight:"-3%",
            marginTop: "-3%",
            right:0,
            float:"right"
          }}
          showSearch
          allowClear
          onSelect={fillForm}
          placeholder="Load Config File"
        >
          {Object.keys(SavedConfigs).map(function(key) {
            return (
              <Option value={key}>{key}</Option>
            );
          })}
        </Select>
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
        <div
          style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"end"
          }}
        >
          <div>
            <h6>Turn on Anonymous Viewing: </h6>
            <Form.Item
              name="anon"
              initialValue={anon}
              valuePropName="checked"
            >
              <Switch onChange={setAnon} />
            </Form.Item>
          </div>
          <div
            className="buttonContainer"
            style={{ display:'flex' }}
          >
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
                style={{ marginRight:100 }}
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
