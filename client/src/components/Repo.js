import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { List, Avatar } from 'antd';

const Repo = ({ repo }) => {
  const repoList = [repo, 'makemake Another Repo', 'makemake Example Repo '];

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
        className="demo-loadmore-list"
        // loading={initLoading}
        itemLayout="horizontal"
        dataSource={repoList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">Details</a>,
              <a key="list-loadmore-more">Analyze</a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  src="https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/144_Gitlab_logo_logos-512.png"
                />
              }
              title={<a href="https://localhost:5050/overview">{item}</a>}
              description="Web app for GitLab Analyzer"
            />
            <div>content</div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Repo;
