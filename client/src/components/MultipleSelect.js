import React, { useEffect, useState } from "react";
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
    const [newSelectedItems, setNewSelectedItems] = useState();
    const userList = ["UserA", "UserB", "UserC", "UserD", "UserE", "UserJJJ", "UserX"] //  fake data

    /*
    // real data
    const memberList = membersList.map((item) => item.name);    // real member data
    // const userList = usersList;     // real data
    const userList = usersList.filter(val => !memberList.includes(val));    // real data
    // const dict = {};
    */

    function handleSelect(value) {
        setSelectedOptions([...selectedOptions, value]);
    }

    function handleDeselect(value) {
        var tempSelectedOptions = selectedOptions; 
        var index = tempSelectedOptions.indexOf(value)
        if (index !== -1) {
            tempSelectedOptions.splice(index, 1);
            setSelectedOptions([...selectedOptions, tempSelectedOptions])
        }
        console.log(selectedOptions)
        console.log(value);
        
        console.log(selectedOptions)
        console.log(value);
       
    }
    
    function handleChange(value) {
        setSelectedItems(value);
        // setSelectedOptions(value);
        // console.log(props.currentMember)

        var dict = mapList;
        dict[props.currentMember] = value;  // this!

        setMapList(dict)
        // setMapList(oldList => ({...oldList, dict}));  // this!
        // setMapList({...mapList, dict}) // this!
        // console.log(mapList)
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
          allowClear
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


