import React from 'react';
import { Form, InputNumber, Col, Row } from 'antd';
import { configSettings } from '../login/Repo';

function LanguagePoints() {
  return (
    <div>
      <h6>Language Points</h6>
      {/* <Form
        // label="Languages"
        name="languages"
      >             */}
        <Row gutter={48} >
          <Col >
            <Form.Item
              label="JavaScript"
              name="javascript"
              initialValue={(configSettings.javascript && configSettings.javascript) || 1}
              rules={[
                { 
                  required: true, 
                  message: 'Please input a number.', 
                },
              ]}
            >
              <InputNumber 
                  // defaultValue={(configSettings.javascript && configSettings.javascript) || 1}
                  onChange={value => configSettings.javascript = value} 
              />
            </Form.Item>
            <Form.Item
              label="Python"
              name="python"
              initialValue={(configSettings.python && configSettings.python) || 1}
              rules={[
                {
                  required: true,
                  message: 'Please input a number.',
                },
              ]}
            >
              <InputNumber 
                // defaultValue={(configSettings.python && configSettings.python) || 1}
                onChange={value => configSettings.python = value} 
              />
            </Form.Item>
          </Col>    
          <Col >
            <Form.Item
              label="HTML"
              name="html"
              initialValue={(configSettings.html && configSettings.html) || 1}
              rules={[
                {
                  required: true,
                  message: 'Please input a number.',
                },
              ]}
            >
              <InputNumber 
                // defaultValue={(configSettings.html && configSettings.html) || 1}
                onChange={value => configSettings.html = value} 
              />
            </Form.Item>
            <Form.Item
              label="CSS"
              name="css"
              initialValue={(configSettings.css && configSettings.css) || 1}
              rules={[
                {
                  required: true,
                  message: 'Please input a number.',
                },
              ]}
            >
              <InputNumber 
                // defaultValue={(configSettings.css && configSettings.css) || 1}
                onChange={value => configSettings.css = value} 
              />
            </Form.Item>
          </Col>
        </Row>
      {/* </Form> */}
    </div>
  );
}

export default LanguagePoints;