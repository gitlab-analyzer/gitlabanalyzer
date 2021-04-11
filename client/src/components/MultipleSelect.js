import React, { useEffect, useState } from "react";
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';

// this version
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
    // const userList = ["User1", "User2", "User3", "User4", "User5", "User6", "MemberA", "MemberB"]; // fake data

    // real data
    const memberList = membersList.map((item) => item.name);    // real member data
    // const userList = usersList;     // real data
    const userList = usersList.filter(val => !memberList.includes(val));    // real data?
    // const dict = {};

    function handleSelect(value) {
        setSelectedOptions([...selectedOptions, value]);
    }

    function handleDeselect(value) {
        var tempSelectedOptions = selectedOptions; 
        var index = tempSelectedOptions.indexOf(value)
        if (index !== -1) {
            tempSelectedOptions.splice(index, 1);
            setSelectedOptions(tempSelectedOptions)
        }
    }
    
    function handleChange(value) {
        setSelectedItems(value);
        // console.log(props.currentMember)

        var dict = mapList;
        // this!
        dict[props.currentMember] = value;
        // console.log(dict);

        setMapList(dict)
        // setMapList(oldList => ({...oldList, dict}));  // this!
        // setMapList({...mapList, dict}) // this!
        // setMapList(dict)
        // console.log(mapList)
    }

    /*
    useEffect( () => {
        console.log("helloooooooo")
        // setMapList(oldList => ({...oldList, dictionary})); 
    }, [mapList])
    */

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






/*
class MultipleSelect extends React.Component {
    
  state = {
    selectedItems: [],
  };

  handleChange = selectedItems => {
    this.setState({ selectedItems });
    console.log(selectedItems);
    console.log(this.props.currentMember);
  };

  render() {
    const userList = ["User1", "User2", "User3", "User4", "User5", "User6"];
    const { selectedItems } = this.state;
    const filteredOptions = userList.filter(o => !selectedItems.includes(o));
    return (
      <Select
        mode="multiple"
        placeholder="Inserted are removed"
        value={selectedItems}
        onChange={this.handleChange}
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
}
*/



export default MultipleSelect


