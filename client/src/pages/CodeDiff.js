import React, { useState, useEffect } from 'react';
import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';
import { Tag, PageHeader, Descriptions, Checkbox, List, Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'react-diff-view/style/index.css';
import './styles.css';
import { useAuth } from '../context/AuthContext';
import CodeInfoCombined from '../components/code_diff_detail/CodeInfoCombined';

const Appdiff = ({ diffText, code }) => {
  const [collapse, setCollapse] = useState(false);
  const { setSpecificFile } = useAuth();
  const files = parseDiff(diffText);

  const multiplier = [1, 0.1, 0, 0, 0, 0, 0, 0.1];
  const fields = [
    'lines_added',
    'lines_deleted',
    'comments_added',
    'comments_deleted',
    'blanks_added',
    'blanks_deleted',
    'spacing_changes',
    'syntax_changes',
  ];

  useEffect(() => {}, [collapse]);

  const handleCollapse = (e) => {
    setCollapse(!collapse);
  };

  const scoreCalculator = () => {
    let score = 0;
    let index = 0;
    for (let line of fields) {
      score += code['line_counts'][line] * multiplier[index];
      index++;
    }

    return score;
  };

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
          <Button type="primary" ghost style={{ marginRight: '10px' }}>
            Score: {scoreCalculator().toFixed(1)}
          </Button>
          <Button
            onClick={() => {
              setSpecificFile(code);
            }}
            type="primary"
            ghost
            style={{ marginRight: '10px' }}
          >
            Score Breakdown
          </Button>
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
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { setCodeDiffId, codeDiffId, codeDiffDetail, specificFile } = useAuth();

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
  }, [codeDiffId, codeDiffDetail]);

  const data = [
    'README.md',
    'scripts/hulk.js',
    'src/diff2html.js',
    'src/joganjs-utils.js',
    'src/line-by-line-printer.js',
    'test/side-by-side.js',
  ];

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

  const codeDiffHeader = () => {
    return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          title={codeDiffDetail['branch']}
          tags={ignoreRenderer()}
          subTitle={tagRenderer()}
          extra={[
            // <Button
            //   onClick={() => {
            //     setShowFiles(!showFiles);
            //   }}
            //   key="1"
            //   type="primary"
            // >
            //   File Changes
            // </Button>,
            <Button
              onClick={() => {
                setShowBreakdown(!showBreakdown);
              }}
              key="2"
              type="primary"
            >
              Score Breakdown
            </Button>,
          ]}
        >
          <Descriptions size="small" column={2}>
            <Descriptions.Item label="Created by">
              {codeDiffDetail['createdBy']}
            </Descriptions.Item>
            <Descriptions.Item label="ID">
              {codeDiffDetail['mrid']}
            </Descriptions.Item>
            <Descriptions.Item label="Merged Date">
              {codeDiffDetail['mergedDate']}
            </Descriptions.Item>
            <Descriptions.Item label="Created On">
              {codeDiffDetail['createdAt']}
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
  const codeDiffTags = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tag color="blue">Overall Score Breakdown</Tag>
        {specificFile ? (
          <Tag
            style={{ marginLeft: '35em', marginRight: 'auto' }}
            color="purple"
          >
            {specificFile['new_path']}
          </Tag>
        ) : null}
      </div>
    );
  };

  return (
    <div
      style={{
        marginLeft: '10px',
        marginRight: '10px',
        marginTop: '10px',
        fontFamily: 'Ubuntu Mono',
      }}
    >
      {codeDiffHeader()}
      {showBreakdown ? codeDiffTags() : null}
      {showBreakdown ? <CodeInfoCombined /> : null}
      {codeDiff ? mapDiff : null}
    </div>
  );
};

export default CodeDiff;
