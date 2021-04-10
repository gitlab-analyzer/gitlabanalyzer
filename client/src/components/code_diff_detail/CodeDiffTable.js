import React, { useState, useEffect } from 'react';
import { Tag, Typography, Table } from 'antd';
import { useAuth } from '../../context/AuthContext';
const { Text } = Typography;

const CodeDiffTable = ({ singleFile }) => {
  const { codeDiffDetail, specificFile } = useAuth();
  const [lcdata, setLcData] = useState(null);
  const lineCounts = codeDiffDetail['lineCounts'];
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

  const capitalize = (line) => {
    return line.charAt(0).toUpperCase() + line.slice(1);
  };

  useEffect(() => {
    console.log('ok', codeDiffDetail);
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
        object.score = (lineCounts[lineName] * multiplier[index]).toFixed(2);
        score += lineCounts[lineName] * multiplier[index];
        data.push(object);
        index++;
      }
      data.push({ name: 'Total', score: score.toFixed(2) });
      setLcData(data);
    };
    constructDataSource();
    console.log('hi');
  }, [codeDiffDetail]);

  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <Text strong>Line counts</Text>,
      dataIndex: 'lc',
      key: 'age',
    },
    {
      title: 'Multiplier',
      dataIndex: 'multiplier',
      key: 'multiplier',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
  ];

  return (
    <>
      {!lcdata ? null : (
        <>
          <Table
            size="small"
            style={{ width: '500px' }}
            dataSource={lcdata}
            columns={columns}
            pagination={false}
          />
        </>
      )}
    </>
  );
};

export default CodeDiffTable;
