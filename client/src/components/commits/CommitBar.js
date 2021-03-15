import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Table, Space, Badge, Tag, Button } from 'antd';
import { CodeFilled, CodeOutlined } from '@ant-design/icons';
import { heatMapDataMR, heatMapDataCommit } from './HeatMapData';
import { useAuth } from '../../context/AuthContext';
import { ResponsiveCalendar } from '@nivo/calendar';

/**
 * Used boilerplate from https://ant.design/components/table/
 */
const CommitBar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showCommits, setShowCommits] = useState(false);
  const {
    membersList,
    mergeRequestList,
    setMergeRequestList,
    selectUser,
  } = useAuth();

  useEffect(() => {}, [selectUser]);

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

  let tempoHeatLog = {};
  // Initialize Heatbar Graph
  const initHeatMap = () => {
    for (let member of membersList) {
      tempoHeatLog[member.name] = [];
    }
  };
  initHeatMap();

  /**
   * Populate Merge Requests with real data
   */
  let mergeRequestData = [];
  let commitsOnlyData = [];
  const selectedUserMRList = mergeRequestList[selectUser] || 0;

  if (selectedUserMRList !== 0) {
    for (let [key, value] of Object.entries(selectedUserMRList['mr'])) {
      const commitsData = [];
      let commitTotalScore = 0;
      for (let [k, v] of Object.entries(value['commitList'])) {
        commitsData.push({
          key: v['shortId'],
          commitid: (
            <a href={v['webUrl']} target="_blank">
              {v['shortId']}
            </a>
          ),
          relatedMr: v['relatedMr'],
          date: dateFormatter(v['comittedDate']),
          score: v['score'].toFixed(1),
          message: v['title'],
          ignore: v['ignore'],
        });
        // This constructs a separate list for commits only
        commitTotalScore += v['score'];
      }
      commitsOnlyData.push(...commitsData);
      mergeRequestData.push({
        key: value['id'],
        mrid: (
          <a href={value['webUrl']} target="_blank">
            {value['id']}
          </a>
        ),
        branch: value['title'],
        mrdiffscore: value['score'].toFixed(1),
        commitssum: commitTotalScore.toFixed(1),
        createdAt: dateFormatter(value['createdDate']),
        commitsList: commitsData,
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      filterMultiple: false,
      onFilter: (value, record) => record.date.indexOf(value) === 0,
      sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date),
      sortDirections: ['descend', 'ascend'],
    },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 420 },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 155,
      sorter: (a, b) => a.score - b.score,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      key: 'state',
      render: () => (
        <span>
          <Badge status="success" color={'blue'} />
          <Tag color="blue">Included</Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <Space size="middle">
          <Button icon={<CodeOutlined />} onClick={showDrawer}>
            Diffs
          </Button>
        </Space>
      ),
    },
  ];

  /**
   * Expandable Row for Commits inside a specific Merge Request
   */
  const expandedRowRender = (commitsList) => {
    return (
      <Table
        columns={columnsCommits}
        dataSource={commitsList}
        rowSelection={{ ...commitSelection, columnTitle: 'ignore' }}
        pagination={false}
      />
    );
  };

  /**
   * Column title for the Merge Requests
   */
  const columns = [
    { title: 'MR ID', dataIndex: 'mrid', key: 'mrid', width: 110 },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    { title: 'Title', dataIndex: 'branch', key: 'branch', width: 315 },
    {
      title: 'MR Diff',
      dataIndex: 'mrdiffscore',
      key: 'mrdiffscore',
      width: 105,
      sorter: (a, b) => a.mrdiffscore - b.mrdiffscore,
    },
    {
      title: 'Commits Sum',
      dataIndex: 'commitssum',
      key: 'commitssum',
      width: 155,
      sorter: (a, b) => a.commitssum - b.commitssum,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',

      render: () => (
        <span>
          <Badge status="success" />
          <Tag color="green">Merged</Tag>
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'operation',
      render: () => (
        <Button type="primary" onClick={showDrawer} icon={<CodeFilled />}>
          Expand
        </Button>
      ),
    },
  ];

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

  // Controllers for the Code Diff Drawer
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
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
  const heatDataToShow = () => {
    return showCommits
      ? heatMapDataCommit[selectUser]
      : heatMapDataMR[selectUser];
  };

  /**
   * Render the Table component which represents the Merge Requests
   * Table represents the MR/Commits data bars
   * Drawer is an experimental feature that renders the Code Diffs for each MR and Commit
   */
  return (
    <>
      <div style={{ height: '300px' }}>
        <ResponsiveCalendar
          data={heatDataToShow()}
          from="2021-03-01"
          to="2021-07-12"
          emptyColor="#eeeeee"
          colors={['#c2f0e7', '#97e3d5', '#61cdbb', '#22bfa5']}
          minValue={0}
          maxValue={20}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          monthSpacing={5}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left',
            },
          ]}
        />
      </div>
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
          expandedRowRender={(record) => expandedRowRender(record.commitsList)}
          dataSource={mergeRequestData}
          rowSelection={{ ...rowSelection, columnTitle: 'ignore' }}
        />
      )}
    </>
  );
};

export default CommitBar;
