import React from 'react';
import { Form, InputNumber, Col, Row, Button, Input, Space } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

function LanguagePoints() {
  return (
    <div>
      <h6 
        style={{ paddingBottom:10 }}
      >
        Extension Points
      </h6>
      <Row>
        <Col>
          <Form.List name="language">
            {(fields, {add, remove}) => (
              <div style={{width:300}}>
                {fields.map((field) => (
                  <Space 
                    key={field.key} 
                    style={{ 
                      display:'flex', 
                      marginBottom:8 
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'extname']}
                      fieldKey={[field.fieldKey, 'extname']}
                      rules={[{ 
                        required:true, 
                        message: 'Missing Extension'
                      }]}
                    >
                      <Input 
                        placeholder="ex: js" 
                      />
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
                    style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}
                    icon={<PlusOutlined style={{ display: 'inline-block', verticalAlign: 'middle' }} />}
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