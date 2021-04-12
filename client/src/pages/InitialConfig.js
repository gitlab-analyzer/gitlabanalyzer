import React from 'react';
import { Form, Divider, Switch } from 'antd';
import LanguagePoints from '../components/config/LanguagePoints';
import IterationDates from '../components/config/IterationDates';
import InitialUserDates from '../components/config/InitialUserDates';
import AnonymousViewing from '../components/config/AnonymousViewing';
import { useAuth } from '../context/AuthContext';

function InitialConfig() {
  const { anon, setAnon } = useAuth();
  return (
    <div>
      <InitialUserDates />
      <Divider />
      <LanguagePoints />
      <Divider />
      <IterationDates />
      <Divider />
      <div>
        <h6>Turn on Anonymous Viewing: </h6>
        <Form.Item name="anon" initialValue={anon} valuePropName="checked">
          <Switch onChange={setAnon} />
        </Form.Item>
      </div>
    </div>
  );
}
export default InitialConfig;
