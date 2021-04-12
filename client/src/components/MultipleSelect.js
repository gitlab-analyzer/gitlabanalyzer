import React, { useState } from "react";
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';

const MultipleSelect = (props) => {
    const {
        membersList,
        usersList,
        mapList, setMapList,
        selectedOptions, 
        setSelectedOptions,
    } = useAuth();

    const [selectedItems, setSelectedItems] = useState([]);

    const memberList = membersList.map((item) => item.name); 
    const userList = usersList.filter(val => !memberList.includes(val));

    function handleSelect(value) {
        setSelectedOptions([...selectedOptions, value]);
    }

    function handleDeselect(value) {
        var tempSelectedOptions = selectedOptions; 
        var index = tempSelectedOptions.indexOf(value);
        if (index !== -1) {
            tempSelectedOptions.splice(index, 1);
            setSelectedOptions([...selectedOptions, tempSelectedOptions]);
        }
       
    }
    
    function handleChange(value) {
        setSelectedItems(value);
        
        var dict = mapList;
        dict[props.currentMember] = value;  
        setMapList(dict);
    }

    const filteredOptions = userList.filter(o => !selectedOptions.includes(o));
    return (
        <Select
          mode="multiple"
          placeholder="None"
          value={selectedItems}
          onChange={handleChange}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          size="large"
          className="multipleSelection"
        >
          {filteredOptions.map(item => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      );
      
}

export default MultipleSelect


