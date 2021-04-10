import React from 'react';
import './CodeDiffDetail.css';

const CodeDiffTextField = ({ lineCounts, multiplier, finalScore }) => {
  const headers = ['', 'Line counts', 'Multiplier', 'Score'];
  const getTableHeader = (headers) => {
    return headers.map((headers, index) => {
      return <th key={index}>{headers}</th>;
    });
  };

  const getRowsData = (lineCounts, multiplier) => {
    const keys = Object.keys(lineCounts);
    return keys.map((keys, index) => {
      return (
        <tr key={index}>
          <th>{keys.replace('_', ' ')}: &emsp;</th>
          <th>{lineCounts[keys]}</th>
          <th>x {multiplier[keys]}</th>
          <th>= {lineCounts[keys] * multiplier[keys]}</th>
        </tr>
      );
    });
  };

  return (
    <div className="score_body">
      <table cellPadding={5}>
        <tbody>
          <tr>{getTableHeader(headers)}</tr>
          {getRowsData(lineCounts, multiplier)}
        </tbody>
      </table>
      <p className="final_score">&nbsp;Total Score: {finalScore}</p>
    </div>
  );
};

export default CodeDiffTextField;
