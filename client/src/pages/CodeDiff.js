import React, { useState, useEffect } from 'react';
import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';
import {
  Popover,
  notification,
  Tag,
  PageHeader,
  Descriptions,
  Checkbox,
  List,
  Button,
} from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'react-diff-view/style/index.css';
import './styles.css';
import { useAuth } from '../context/AuthContext';
import CodeDiffTextFields from '../components/code_diff_detail/CodeDiffTextFields';

const Appdiff = ({ diffText, code }) => {
  const [collapse, setCollapse] = useState(false);
  const files = parseDiff(diffText);

  const multiplier = {
    lines_added: 1,
    lines_deleted: 0.1,
    comments_added: 0,
    comments_deleted: 0,
    blanks_added: 0,
    blanks_deleted: 0,
    spacing_changes: 0,
    syntax_changes: 0.1,
  };
  const scoreDetail = {
    lines_added: code['lines_added'],
    lines_deleted: code['lines_deleted'],
    comments_added: code['comments_added'],
    comments_deleted: code['comments_deleted'],
    blanks_added: code['blanks_added'],
    blanks_deleted: code['blanks_deleted'],
    spaced_changes: code['spacing_changes'],
    syntax_changes: code['syntax_changes'],
  };

  const handleCollapse = (e) => {
    setCollapse(!collapse);
  };

  useEffect(() => {}, [collapse]);

  const renderFile = ({
    oldPath,
    newPath,
    oldRevision,
    newRevision,
    type,
    hunks,
  }) => (
    <div key={oldRevision + '-' + newRevision} className="file-diff">
      <header
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className="diff-header"
      >
        {oldPath === newPath ? oldPath : `${oldPath} -> ${newPath}`}
        <div>
          <Button style={{ marginRight: '10px' }}>Score: 800</Button>
          <Button style={{ marginRight: '10px' }}>Score Breakdown</Button>
          <Checkbox>Ignore</Checkbox>
          <Checkbox onChange={handleCollapse}>Collapse</Checkbox>
        </div>
      </header>
      {collapse ? null : (
        <Diff
          className="ubuntu"
          viewType="unified"
          diffType={type}
          hunks={hunks}
        >
          {(hunks) =>
            hunks.map((hunk) => [
              <Decoration key={'deco-' + hunk.content}>
                <div className="hunk-header">{hunk.content}</div>
              </Decoration>,
              <Hunk className="ubuntu" key={hunk.content} hunk={hunk} />,
            ])
          }
        </Diff>
      )}
    </div>
  );
  return <div className="ubuntu">{files.map(renderFile)}</div>;
};

const CodeDiff = ({ codeId }) => {
  const [codeDiff, setCodeDiff] = useState([]);
  const [codeFiles, setCodeFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [breakdown, setBreakdown] = useState({});

  const { setCodeDiffId, codeDiffId, codeDiffDetail } = useAuth();

  useEffect(() => {
    const getData = async () => {
      const codeRes = await axios.get(
        `http://localhost:5678/projects/2/code_diff/${codeDiffId}`
      );
      await setCodeDiff(codeRes.data.code_diff_list);
      const files = codeDiff.map((code) => code.new_path);
      setCodeFiles(files);
    };
    getData();
    console.log('codeDiffDetail', codeDiffDetail);
  }, [codeDiffId, codeDiffDetail]);

  const data = [
    'README.md',
    'scripts/hulk.js',
    'src/diff2html.js',
    'src/joganjs-utils.js',
    'src/line-by-line-printer.js',
    'test/side-by-side.js',
  ];

  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  const tagRenderer = () => {
    if (codeDiffDetail['type'] === 'mr') {
      return <Tag color="green">Merge Request</Tag>;
    } else {
      return <Tag color="blue">Commit</Tag>;
    }
  };

  const ignoreRenderer = () => {
    if (codeDiffDetail['ignore']) {
      return <Tag color="red">Ignored</Tag>;
    } else {
      return <Tag color="cyan">Included</Tag>;
    }
  };

  const openNotification = () => {
    const args = {
      message: 'Notification Title',
      description:
        'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      duration: 0,
    };
    notification.open(args);
  };

  const codeDiffHeader = () => {
    return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          title={codeDiffDetail['branch']}
          tags={ignoreRenderer()}
          subTitle={tagRenderer()}
          extra={[
            <Button
              onClick={() => {
                setShowFiles(!showFiles);
              }}
              key="1"
              type="primary"
            >
              File Changes
            </Button>,
            <Popover
              style={{ zIndex: '500', position: 'relative' }}
              content={content}
              title="Title"
            >
              <Button key="2" type="primary">
                Score Breakdown
              </Button>
            </Popover>,
          ]}
        >
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="Created by">
              {codeDiffDetail['createdBy']}
            </Descriptions.Item>
            <Descriptions.Item label="ID">
              {codeDiffDetail['mrid']}
            </Descriptions.Item>
            <Descriptions.Item label="Created On">
              {codeDiffDetail['createdAt']}
            </Descriptions.Item>
            <Descriptions.Item label="Merged Date">
              {codeDiffDetail['mergedDate']}
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </div>
    );
  };

  const fileChanges = () => {
    return (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex' }}>
          <h2 style={{ marginRight: '10px' }}>File changed</h2>
          <Button
            onClick={() => {
              setShowFiles(!showFiles);
            }}
          >
            Show
          </Button>
        </div>
      </div>
    );
  };

  const fileList = () => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <List
          size="small"
          dataSource={codeFiles}
          renderItem={(item) => (
            <List.Item>
              <FileExcelOutlined /> {item}
            </List.Item>
          )}
        />
      </div>
    );
  };

  // console.log(codeDiff[0].diff);

  const header =
    'diff --git a/requirements.txt b/requirements.txt\nindex c3f75dc..2cda10e 100644\n--- a/requirements.txt\n+++ b/requirements.txt\n';

  const headerGenerator = (code) => {
    let header = 'diff --git';
    header =
      header +
      ' a/' +
      code.old_path +
      ' b/' +
      code.new_path +
      '\n' +
      'index c3f75dc..2cda10e 100644\n' +
      '--- a/' +
      code.old_path +
      '\n+++ b/' +
      code.new_path +
      '\n';
    return header + code.diff;
  };

  const mapDiff = codeDiff.map((code) => (
    <>
      <Appdiff diffText={headerGenerator(code)} code={code} />
      {/* <Appdiff diffText={header + code.diff} /> */}
    </>
  ));

  return (
    <div
      style={{
        marginLeft: '10px',
        marginRight: '10px',
        marginTop: '10px',
        fontFamily: 'Ubuntu Mono',
      }}
    >
      {/* <Appdiff diffText={wow} /> */}
      {codeDiffHeader()}
      {showFiles ? fileList() : null}
      {codeDiff ? mapDiff : null}
    </div>
  );
};

export default CodeDiff;
