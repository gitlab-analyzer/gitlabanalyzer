import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { Input } from 'antd';
import { useAuth } from '../../context/AuthContext';

const { Search } = Input;

const SearchBarComp = ({ reList, setFilteredList }) => {
  const [value, setValue] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    if (value === '') {
      setFilteredList(reList);
    } else {
      setFilteredList(
        reList.filter((repo) =>
          repo.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }, [value]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleOnChange = async (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="main">
      <div className="bar_container">
        <form className="flex" onSubmit={handleSubmit}>
          <Search
            value={value}
            style={{ width: '650px' }}
            placeholder="Search a repository"
            allowClear
            enterButton="Search"
            size="large"
            onChange={handleOnChange}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBarComp;
