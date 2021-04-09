import React from 'react';
import { DatePicker, Form, Space, Input, Button } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

function IterationDates() {
  return (
    <div>
      <h6 
        style={{paddingBottom:10}}
      >
        Iteration Duration
      </h6>
      
      <Form.List name="iterations">
        {(fields, {add, remove}) => (
          <div style={{width:"550px"}}>
            {fields.map((field, index) => (
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
                  name={[field.name, 'itername']}
                  fieldKey={[field.fieldKey, 'itername']}
                  rules={[{ 
                    required:true, 
                    message: 'Missing Iteration Name'
                  }]}
                >
                  <Input 
                    placeholder="Iteration Name" 
                  />
                </Form.Item>
                <p>:</p>
                <Form.Item
                  {...field}
                  name={[field.name, 'iterdates']}
                  fieldKey={[field.fieldKey, 'iterdate']}
                  rules={[{ 
                    required: true, 
                    message: 'Missing Dates'
                  }]}
                >
                  <RangePicker
                    format="YYYY/MM/DD hh:mm:ss"
                    showTime
                  />
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
                Add Iteration
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </div>
  );
}

export default IterationDates;
