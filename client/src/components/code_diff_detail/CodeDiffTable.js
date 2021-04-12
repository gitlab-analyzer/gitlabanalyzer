import React, { useState, useEffect } from 'react';
import { Empty, Tag, Typography, Table } from 'antd';
import { useAuth } from '../../context/AuthContext';
const { Text } = Typography;

const CodeDiffTable = ({ singleFile }) => {
  const { codeDiffDetail, specificFile } = useAuth();
  const [lcdata, setLcData] = useState(null);
  let lineCounts = null;
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
  const dataLoader = () => {
    if (singleFile) {
      if (!specificFile) {
        return null;
      }
      return {
        lines_added: specificFile['line_counts']['lines_added'],
        lines_deleted: specificFile['line_counts']['lines_deleted'],
        comments_added: specificFile['line_counts']['comments_added'],
        comments_deleted: specificFile['line_counts']['comments_deleted'],
        blanks_added: specificFile['line_counts']['blanks_added'],
        blanks_deleted: specificFile['line_counts']['blanks_deleted'],
        spacing_changes: specificFile['line_counts']['spacing_changes'],
        syntax_changes: specificFile['line_counts']['syntax_changes'],
      };
    } else {
      return codeDiffDetail['lineCounts'];
    }
  };
  lineCounts = dataLoader();

  const capitalize = (line) => {
    return line.charAt(0).toUpperCase() + line.slice(1);
  };

  useEffect(() => {
    if (!singleFile || lineCounts) {
      const constructDataSource = () => {
        let index = 0;
        let data = [];
        let score = 0;
        for (let lineName of fields) {
          let object = {};
          object.key = lineName;
          object.name = capitalize(lineName.replace('_', ' '));
          object.lc = lineCounts[lineName];
          object.multiplier = 'x ' + multiplier[index].toString();
          object.score = (lineCounts[lineName] * multiplier[index]).toFixed(1);
          score += lineCounts[lineName] * multiplier[index];
          data.push(object);
          index++;
        }
        data.push({ name: 'Total', score: score.toFixed(1) });
        setLcData(data);
      };
      constructDataSource();
    }
  }, [codeDiffDetail, specificFile]);

  const columns = [
    {
      title: 'Changes made',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <Text strong>Line counts</Text>,
      dataIndex: 'lc',
      align: 'right',
      key: 'age',
    },
    {
      title: 'Multiplier',
      dataIndex: 'multiplier',
      align: 'right',
      key: 'multiplier',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      align: 'right',
      key: 'score',
    },
  ];

  const loadingSim = () => {
    if (!lcdata) {
      return null;
    } else if (singleFile) {
      return (
        <Table
          size="small"
          style={{ width: '500px', marginRight: '112px', marginLeft: 'auto' }}
          dataSource={lcdata}
          columns={columns}
          pagination={false}
        />
      );
    } else {
      return (
        <Table
          size="small"
          style={{ width: '500px' }}
          dataSource={lcdata}
          columns={columns}
          pagination={false}
        />
      );
    }
  };

  return <>{loadingSim()}</>;
};

export default CodeDiffTable;
