import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Table, Space, Tag, Button, Input, InputNumber, Form } from 'antd';
import { CodeFilled, CodeOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import DisplayScore from './DisplayScore';

/**
 * Used boilerplate from https://ant.design/components/table/
 */
const CommitBar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showCommits, setShowCommits] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const [form] = Form.useForm();
  const {
    membersList,
    mergeRequestList,
    setMergeRequestList,
    selectUser,
    codeDiffId,
    setCodeDiffId,
    codeDrawer,
    setCodeDrawer,
    codeDiffDetail,
    setCodeDiffDetail,
    dataList,
    setSpecificFile,
  } = useAuth();

  useEffect(() => {}, [selectUser, codeDiffId, codeDiffDetail, dataList]);

  // This is the date formatter that formats in the form: Mar 14 @ 8:30pm if same year
  // if not, Mar 14 2020 @ 8:30pm
  const dateFormatter = (dateObject) => {
    let today = new Date();
    let ampm = '';
    let thisYear = today.getFullYear();
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let month = dateObject.getMonth();
    let day = dateObject.getDate();
    let year = dateObject.getFullYear();
    let hour = dateObject.getHours();
    let minute = dateObject.getMinutes();

    if (hour === 0) {
      hour = 12;
      ampm = 'am';
    } else if (hour >= 13) {
      hour -= 12;
      ampm = 'pm';
    } else {
      ampm = 'am';
    }

    if (minute < 10) {
      minute = '0' + minute;
    }

    if (thisYear === year) {
      return `${months[month]} ${day} @ ${hour}:${minute}${ampm}`;
    } else {
      return `${months[month]} ${year} ${day} @ ${hour}:${minute}${ampm}`;
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  /**
   * Populate Merge Requests with real data
   */
  let mergeRequestData = [];
  let commitsOnlyData = [];
  let unmergedData = [];
  const selectedUserMRList = mergeRequestList[selectUser] || 0;

  if (selectedUserMRList !== 0) {
    for (let [key, value] of Object.entries(selectedUserMRList['mr'])) {
      const commitsData = [];
      let commitTotalScore = 0;
      let skip = false;
      for (let [k, v] of Object.entries(value['commitList'])) {
        if (
          v['comittedDate'] < new Date(dataList[0]) ||
          v['comittedDate'] > new Date(dataList[1]) ||
          v['mergedDate'] < new Date('1971-01-01T00:00:00.000Z')
        ) {
          continue;
        }

        let codeDiffCommitScore = 0;
        for (let [k1, v1] of Object.entries(v['codeDiffDetail'])) {
          if (!v1['ignore']) {
            codeDiffCommitScore += v1['score'];
          }
        }

        commitsData.push({
          key: v['shortId'],
          commitid: (
            <a href={v['webUrl']} target="_blank">
              {v['shortId']}
            </a>
          ),
          relatedMr: v['relatedMr'],
          comitterName: v['committerName'],
          codeDiffId: v['codeDiffId'],
          date: dateFormatter(v['comittedDate']),
          score: v['score'].toFixed(1),
          message: v['title'],
          ignore: v['ignore'],
          codeDiffDetail: v['codeDiffDetail'],
          lineCounts: v['lineCounts'],
        });
        // This constructs a separate list for commits only
        commitTotalScore += v['score'];
      }
      commitsOnlyData.push(...commitsData);
      if (
        value['mergedDate'] < new Date(dataList[0]) ||
        value['mergedDate'] > new Date(dataList[1]) ||
        value['mergedDate'] < new Date('1971-01-01T00:00:00.000Z')
      ) {
        continue;
      }

      let codeDiffScore = 0;
      for (let [k1, v1] of Object.entries(value['codeDiffDetail'])) {
        if (!v1['ignore']) {
          codeDiffScore += v1['score'];
        }
      }
      mergeRequestData.push({
        key: value['id'],
        mrid: (
          <a href={value['webUrl']} target="_blank">
            {value['id']}
          </a>
        ),
        author: value['author'].name,
        ignore: value['ignore'],
        lineCounts: {
          ...value['lineCounts'],
        },
        branch: value['title'],
        mrdiffscore: codeDiffScore.toFixed(1),
        commitssum: commitTotalScore.toFixed(1),
        createdAt: dateFormatter(value['createdDate']),
        mergedDate: dateFormatter(value['mergedDate']),
        commitsList: commitsData,
        codeDiffId: value['codeDiffId'],
      });
    }
  }

  const columnsCommits = [
    {
      title: 'Commit ID',
      dataIndex: 'commitid',
      key: 'commitid',
      width: 110,
    },
    {
      title: 'Commiter',
      dataIndex: 'comitterName',
      key: 'comitterName',
      width: 110,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      filterMultiple: false,
      onFilter: (value, record) => record.date.indexOf(value) === 0,
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      sortDirections: ['descend', 'ascend'],
    },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 300 },

    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      sorter: (a, b) => a.score - b.score,
      sortDirections: ['descend', 'ascend'],
      editable: true,
    },
    {
      title: 'Status',
      key: 'state',
      render: () => (
        <span>
          <Tag color="blue">Included</Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<CodeOutlined />}
            onClick={() => {
              handleSetCodeDiff(text, record);
            }}
          >
            Diffs
          </Button>
        </Space>
      ),
    },
  ];
  const mergedColumns = columnsCommits.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'score' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  /**
   * Expandable Row for Commits inside a specific Merge Request
   */
  const expandedRowRender = (commitsList) => {
    return (
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          // columns={columnsCommits}
          columns={mergedColumns}
          dataSource={commitsList}
          rowSelection={{ ...commitSelection, columnTitle: 'ignore' }}
          pagination={false}
        />
      </Form>
    );
  };

  /**
   * Column title for the Merge Requests
   */
  const columns = [
    { title: 'MR ID', dataIndex: 'mrid', key: 'mrid', width: 90 },
    { title: 'Author', dataIndex: 'author', key: 'author', width: 110 },
    { title: 'Date', dataIndex: 'mergedDate', key: 'mergedDate', width: 160 },
    { title: 'Title', dataIndex: 'branch', key: 'branch', width: 300 },
    {
      title: 'MR Diff',
      dataIndex: 'mrdiffscore',
      key: 'mrdiffscore',
      width: 105,
      sorter: (a, b) => a.mrdiffscore - b.mrdiffscore,
    },
    {
      title: 'Sum',
      dataIndex: 'commitssum',
      key: 'commitssum',
      width: 120,
      sorter: (a, b) => a.commitssum - b.commitssum,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

      render: (text, record) => {
        if (record['ignore']) {
          return (
            <span>
              <Tag color="red">Ignored</Tag>
            </span>
          );
        } else {
          return (
            <span>
              <Tag color="green">Merged</Tag>
            </span>
          );
        }
      },
    },
    {
      title: 'Action',
      key: 'operation',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => {
            handleSetCodeDiff(text, record);
            setSpecificFile(null);
          }}
          icon={<CodeFilled />}
        >
          Expand
        </Button>
      ),
    },
  ];

  const generateCodeDiffDetail = (record, type) => {
    if (type === 'mr') {
      const codeDetails = {
        createdBy: record['author'],
        branch: record['branch'],
        createdAt: record['createdAt'],
        mergedDate: record['mergedDate'],
        ignored: record['ignore'],
        mrid: record['mrid'],
        lineCounts: {
          ...record['lineCounts'],
        },
        type: 'mr',
      };
      return codeDetails;
    } else {
      const codeDetails = {
        comitterName: record['comitterName'],
        relatedMr: record['relatedMr'],
        date: record['date'],
        ignored: record['ignore'],
        key: record['key'],
        score: record['score'],
        message: record['message'],
        commitid: record['commitid'],
        lineCounts: {
          ...record['lineCounts'],
        },
        type: 'cm',
      };
      return codeDetails;
    }
  };

  const handleSetCodeDiff = (text, record) => {
    setCodeDiffId(record['codeDiffId']);
    if (record['comitterName']) {
      setCodeDiffDetail(generateCodeDiffDetail(record, 'cm'));
    } else {
      setCodeDiffDetail(generateCodeDiffDetail(record, 'mr'));
    }
    setCodeDrawer(true);
  };

  const ignoreCommit = (commitId, relatedMr, value) => {
    const newMergeRequestState = {
      ...mergeRequestList,
      [selectUser]: {
        mr: {
          ...mergeRequestList[selectUser]['mr'],
          [relatedMr]: {
            ...mergeRequestList[selectUser]['mr'][relatedMr],
            commitList: {
              ...mergeRequestList[selectUser]['mr'][relatedMr].commitList,
              [commitId]: {
                ...mergeRequestList[selectUser]['mr'][relatedMr].commitList[
                  commitId
                ],
                ignore: value,
              },
            },
          },
        },
        weightedScore: mergeRequestList[selectUser]['weightedScore'],
      },
    };
    setMergeRequestList(newMergeRequestState);
  };

  const ignoreMR = (commitId, relatedMr, value) => {
    const newMergeRequestState = {
      ...mergeRequestList,
      [selectUser]: {
        mr: {
          ...mergeRequestList[selectUser]['mr'],
          [relatedMr]: {
            ...mergeRequestList[selectUser]['mr'][relatedMr],
            ignore: value,
          },
        },
        weightedScore: mergeRequestList[selectUser]['weightedScore'],
      },
    };
    for (let [k, v] of Object.entries(
      newMergeRequestState[selectUser]['mr'][relatedMr]['commitList']
    )) {
      v.ignore = value;
    }
    setMergeRequestList(newMergeRequestState);
  };

  // This object defines the behavior of ignore selectors
  const commitSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    onSelect: (record, selected, selectedRows) => {
      ignoreCommit(record['key'], record['relatedMr'], selected);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

  // This object defines the behavior of ignore selectors
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    onSelect: (record, selected, selectedRows) => {
      ignoreMR(record['key'], record['key'], selected);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {},
  };

  // Event handler for merge/commit Buttons
  const onMergeHandler = (e) => {
    e.preventDefault();
    setShowCommits(false);
  };

  const onCommitHandler = (e) => {
    e.preventDefault();
    setShowCommits(true);
  };

  const mergeCommitButtonBar = () => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={onMergeHandler} type={showCommits ? '' : 'primary'}>
          Merge Requests
        </Button>
        <Button
          onClick={onCommitHandler}
          type={showCommits ? 'primary' : ''}
          style={{ marginLeft: '10px' }}
        >
          Commits
        </Button>
      </div>
    );
  };

  /**
   * Render the Table component which represents the Merge Requests
   * Table represents the MR/Commits data bars
   * Drawer is an experimental feature that renders the Code Diffs for each MR and Commit
   */
  return (
    <>
      <div style={{ marginTop: '30px' }}>
        <DisplayScore />
        {mergeCommitButtonBar()}
        {showCommits ? (
          <Table
            className="components-table-demo-nested"
            columns={columnsCommits}
            dataSource={commitsOnlyData}
            rowSelection={{ ...commitSelection, columnTitle: 'ignore' }}
            pagination={false}
          />
        ) : (
          <Table
            className="components-table-demo-nested"
            columns={columns}
            pagination={false}
            expandedRowRender={(record) =>
              expandedRowRender(record.commitsList)
            }
            dataSource={mergeRequestData}
            rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
          />
        )}
      </div>
    </>
  );
};

export default CommitBar;
