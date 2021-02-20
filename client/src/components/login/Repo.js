import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, List, Avatar } from 'antd';

const Repo = ({ repo }) => {
  const repoList = [
    repo,
    'Administrator / Earth GitLab 373',
    'Administrator / Mars GitLab 373',
    'Administrator / Jupiter GitLab 373',
  ];

  return (
    <div>
      {/* <Button
        component={Link}
        to="/overview"
        variant="contained"
        color="primary"
      >
        {repo}
      </Button> */}

      <List
        style={{ marginTop: '20px' }}
        className="demo-loadmore-list"
        // loading={initLoading}
        itemLayout="horizontal"
        dataSource={repoList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button key="details">Details</Button>,
              <Button key="analyze">Analyze</Button>,
              <Checkbox>Batch</Checkbox>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  src="https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/144_Gitlab_logo_logos-512.png"
                />
              }
              title={<a href="http://localhost:5050/overview">{item}</a>}
              description="Web app for GitLab Analyzer"
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Repo;
