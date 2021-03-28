import React from 'react';
import { Switch } from 'antd';
import { useAuth } from '../../context/AuthContext';

function AnonymousViewing() {
  const { anon, setAnon } = useAuth();
  return (
    <div>
      <h6>Turn on Anonymous Viewing: </h6>
      <Switch defaultChecked={anon} onChange={(checked) => setAnon(checked)} />
    </div>
  );
}
export default AnonymousViewing;
