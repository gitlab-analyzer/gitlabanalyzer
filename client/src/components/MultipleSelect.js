import React, { useEffect, useState } from "react";
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';

const userList = ["User1", "User2", "User3", "User4", "User5", "User6"];

const MultipleSelect = (props) => {

    const [selectedItems, setSelectedItems] = useState([]);
    const [newSelectedItems, setNewSelectedItems] = useState();
    const {
        mapList, setMapList
    } = useAuth();
    // const dict = {};
    
    function handleChange(value) {
        setSelectedItems(value)
        console.log(value);
        // console.log(this.props.currentMember);
        // console.log(props.currentMember)

        var dict = {};
        dict[props.currentMember] = value
        console.log(dict);
        setMapList({...dict})
        // setMapList(dict)

        // console.log(mapList)
    }

    
    //const { selectedItems } = this.state;
    const filteredOptions = userList.filter(o => !selectedItems.includes(o));
        return (
          <Select
            mode="multiple"
            placeholder="Inserted are removed"
            value={selectedItems}
            onChange={handleChange}
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
      

      /*
    return (
        <Select 
            size="large"
            className="multipleSelection"
            mode="multiple"
            allowClear
            placeholder="None"
            onChange={handleChange}
        >
            {userList}
        </Select>
    )
    */
}





/*
const userList = ["User1", "User2", "User3", "User4", "User5", "User6"];

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


