import React from 'react';
import { Form, InputNumber, Col, Row, Button, Input, Space } from 'antd';
import { configSettings } from '../login/Repo';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

function LanguagePoints() {
  return (
    <div>
      <h6 
        style={{paddingBottom:10}}
      >
        Language Points
      </h6>
      <Row>
        <Col>
          <Form.List name="language">
            {(fields, {add, remove}) => (
              <div style={{width:300}}>
                {fields.map((field, index) => (
                  <Space 
                    key={field.key} 
                    style={{ 
                      display:'flex', 
                      marginBottom:8 
                    }}
                    align="baseline"
                  >
                    {/* <p>.</p> */}
                    <Form.Item
                      {...field}
                      name={[field.name, 'extname']}
                      fieldKey={[field.fieldKey, 'extname']}
                      // onValuesChange={(field) => {tempitername=field.target.value}}
                      rules={[{ 
                        required:true, 
                        message: 'Missing Extension'
                      }]}
                    >
                      <Input 
                        placeholder="ex: js" 
                        // addonBefore="."
                        // onValuesChange={(field) => {tempitername=field.target.value}}
                      />
                      {/* {console.log('tempitername',tempitername, index)} */}
                    </Form.Item>
                    <p>:</p>
                    <Form.Item
                      {...field}
                      name={[field.name, 'extpoint']}
                      fieldKey={[field.fieldKey, 'extpoint']}
                      rules={[{ 
                        required: true, 
                        message: 'Missing Points'
                      }]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <CloseOutlined 
                      style={{ color:'red' }}
                      onClick={() => remove(field.name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                  >
                    Add Language
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Col>
      </Row>
    </div>
  );
}

export default LanguagePoints;