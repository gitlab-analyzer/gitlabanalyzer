import React from 'react';
import { Switch, Form } from 'antd';
import { useAuth } from '../../context/AuthContext';

function AnonymousViewing() {
  const { anon, setAnon } = useAuth();
  return (
    <div>
      <h6>Turn on Anonymous Viewing: </h6>
        <Form.Item
          name="anon"
          initialValue={anon}
        >
          <Switch defaultChecked={anon} onChange={(checked) => setAnon(checked)} />
        </Form.Item>
    </div>
  );
}
export default AnonymousViewing;
