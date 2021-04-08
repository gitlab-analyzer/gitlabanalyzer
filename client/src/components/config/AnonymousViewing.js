import React, { useEffect } from 'react';
import { Switch, Form } from 'antd';
import { useAuth } from '../../context/AuthContext';

function AnonymousViewing(prop) {
  const { anon, setAnon } = useAuth();
    useEffect(()=>{},[]);
  return (
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
  );
}
export default AnonymousViewing;
