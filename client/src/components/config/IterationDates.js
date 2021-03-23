import React from 'react';
import { DatePicker, Form, Space, Input, Button } from 'antd';
import { configSettings } from '../login/Repo';
import moment from 'moment';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

function IterationDates() {
  let tempitername;
  return (
    <div>
      <h6>Iteration Duration</h6>
      <Form.List name="iterations">
        {(fields, {add, remove}) => (
          <div style={{width:500}}>
            {fields.map(field => (
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
                  rule={[{ 
                    required:true, 
                    message: 'Missing Iteration Name'
                  }]}
                >
                  <Input 
                    placeholder="Iteration Name" 
                    onChange={(field) => {tempitername=field}}
                  />
                  {console.log('itername', tempitername)}
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
                  {console.log('field', field)}
                  {console.log('value', field.value)}
                  <RangePicker
                    format="YYYY/MM/DD hh:mm:ss"
                    showTime
                    onChange={(value) => {
                      configSettings.iteration.iter1start = value[0].format();
                      configSettings.iteration.iter1end = value[1].format();
                    }}
                  />
                  {console.log(configSettings.iteration.iter1start, configSettings.iteration.iter1end)}
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
