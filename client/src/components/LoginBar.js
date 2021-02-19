import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import { Button, Input, Tooltip, Select } from 'antd';
import {
  InfoCircleOutlined,
  UserOutlined,
  GitlabOutlined,
} from '@ant-design/icons';
import InputBase from '@material-ui/core/InputBase';
import useStyles from './BarStyles';
import './SearchBar.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const { Option } = Select;
const LoginBar = () => {
  const [token, setToken] = useState('');
  const [url, setUrl] = useState('');
  const [urlPre, setUrlPre] = useState('https://');
  const [urlPost, setUrlPost] = useState('.ca');
  const classes = useStyles();

  // Global states from Context API
  const { user, setUser, setIncorrect } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      console.log('Logged in');
    } else {
      try {
        const userInfo = await logIn();
        if (userInfo.data['response'] === 'valid') {
          console.log('Log in Successful');
          setIncorrect(false);
          setUser(userInfo.data['username']);
          localStorage.setItem('user', userInfo.data['username']);
        } else {
          console.log('Incorrect token');
          setIncorrect(true);
        }
        // TODO Error handling on failed request
      } catch (err) {
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

  // POST request to backend server
  const logIn = async () => {
    const bodyFormData = new FormData();
    const fullUrl = urlPre + url + urlPost;
    bodyFormData.append('token', token);
    bodyFormData.append('url', fullUrl);
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5000/auth',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  };

  const selectBefore = (
    <Select
      onChange={(value) => {
        setUrlPre(value);
      }}
      defaultValue="http://"
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
          {/* <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              value={token}
              onChange={(event) => {
                setToken(event.target.value);
              }}
              placeholder="Personal Token"
              inputProps={{ 'aria-label': 'personal token' }}
            />
          </Paper>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
              }}
              placeholder="gitlab url"
              inputProps={{ 'aria-label': 'gitlab url' }}
            />
          </Paper> */}
          <Input
            style={{ width: '500px' }}
            size="large"
            value={token}
            onChange={(event) => {
              setToken(event.target.value);
              console.log(token);
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
              addonBefore={selectBefore}
              addonAfter={selectAfter}
              defaultValue="mysite"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                console.log(urlPre, url, urlPost);
              }}
            />
          </div>
          <Button
            type="primary"
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
