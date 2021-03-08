import React from 'react'
import { useTable } from "react-table";

const TablePage = () => {
    const columns = [
        {
          Header: "Date",
          accessor: "date",
        },
        {
          Header: "Word Count",
          accessor: "wordcount",
        },
        {
          Header: "Ownership",
          accessor: "ownership",
        },
        {
          Header: "Type",
          accessor: "type",
        },
      ];

      const data = [
        {
          date: "01/28/2021",
          wordcount: 26,
          ownership:'Own',
          type:'Code Review'
        },
        {
            date: "01/28/2021",
            wordcount: 26,
            ownership:'Own',
            type:'Code Review'
          },
          {
            date: "01/28/2021",
            wordcount: 26,
            ownership:'Own',
            type:'Code Review'
          },
          {
            date: "01/28/2021",
            wordcount: 26,
            ownership:'Own',
            type:'Code Review'
          },
      ];

      const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
    return (
        <div className="containers">
        <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    )
}

export default TablePage
