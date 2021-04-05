import React, { useState, useEffect } from 'react';
import { Button, Input, Tooltip, Select } from 'antd';
import { InfoCircleOutlined, GitlabOutlined } from '@ant-design/icons';
import useStyles from './BarStyles';
import './SearchBar.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const { Option } = Select;

/**
 * Login Bar component: has Token bar, Url bar, and buttons to submit
 */
const LoginBar = ({ setRedirect }) => {
  // Local states
  const [token, setToken] = useState('');
  const [url, setUrl] = useState('');
  const [urlPre, setUrlPre] = useState('https://');
  const [urlPost, setUrlPost] = useState('.ca');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  // Global states from Context API
  const { user, setUser, setIncorrect } = useAuth();
  useEffect(() => {}, [loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      console.log('Logged in');
    } else {
      try {
        setLoading(true);
        const userInfo = await logIn();
        if (userInfo.data['response'] === true) {
          setLoading(false);
          setIncorrect(false);
          setUser(userInfo.data['username']);
          sessionStorage.setItem('user', userInfo.data['username']);
          setRedirect(true);
        } else {
          setLoading(false);
          setIncorrect(true);
        }
        // TODO Error handling on failed request
      } catch (err) {
        setIncorrect(true);
        setLoading(false);
        console.log(err);
      }
    }
  };

  // FOR TESTING ONLY
  // Automatically fills in the token and URL
  const handleJustLogIn = async (event) => {
    event.preventDefault();
    setToken('EJf7qdRqxdKWu1ydozLe');
    setUrlPre('https://');
    setUrlPost('.ca');
    setUrl('cmpt373-1211-12.cmpt.sfu');
  };

  // POST request to backend server with the login information
  const logIn = async () => {
    const bodyFormData = new FormData();
    const fullUrl = urlPre + url + urlPost;
    bodyFormData.append('token', token);
    bodyFormData.append('url', fullUrl);
    axios.defaults.withCredentials = true;
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5678/auth',
      data: bodyFormData,
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  };

  const selectBefore = (
    <Select
      onChange={(value) => {
        setUrlPre(value);
      }}
      defaultValue="https://"
      className="select-before"
    >
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );
  const selectAfter = (
    <Select
      onChange={(value) => {
        setUrlPost(value);
      }}
      defaultValue=".ca"
      className="select-after"
    >
      <Option value=".com">.com</Option>
      <Option value=".ca">.ca</Option>
      <Option value=".org">.org</Option>
    </Select>
  );

  return (
    <div className="main">
      <div className="bar_container">
        <form onSubmit={handleSubmit}>
          <Input
            style={{ width: '500px' }}
            size="large"
            value={token}
            onChange={(event) => {
              setToken(event.target.value);
            }}
            placeholder="Enter your GitLab token"
            prefix={<GitlabOutlined />}
            suffix={
              <Tooltip title="Your GitLab personal access token">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
          <div style={{ marginBottom: 10, marginTop: 10 }}>
            <Input
              style={{ width: '500px' }}
              addonBefore={selectBefore}
              addonAfter={selectAfter}
              defaultValue="mysite"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
              }}
            />
          </div>
          <Button
            type="primary"
            loading={loading}
            htmlType="submit"
            className={classes.logInButton}
          >
            Log In
          </Button>
        </form>
        <Button
          type="primary"
          onClick={handleJustLogIn}
          className={classes.logInButton}
        >
          Fill
        </Button>
      </div>
    </div>
  );
};

export default LoginBar;
