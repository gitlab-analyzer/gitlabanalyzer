import React, { useEffect, useState } from "react";
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';


const MultipleSelect = (props) => {
    const {
        usersList,
        mapList, setMapList,
    } = useAuth();

    const [selectedItems, setSelectedItems] = useState([]);
    const [newSelectedItems, setNewSelectedItems] = useState();
    // const userList = ["User1", "User2", "User3", "User4", "User5", "User6"];
    const userList = usersList;
    const dict = [];
    const [dictionary, setDictionary] = useState({});
    
    function handleChange(value) {
        setSelectedItems(value)
        // console.log(value);
        // console.log(this.props.currentMember);
        // console.log(props.currentMember)

        // var dict = {};
        // dict[props.currentMember] = value
        dict.push({
            key: props.currentMember,
            value: value
        })
        console.log(dict);

        setDictionary({...dictionary, dict})
        // console.log(dictionary)
        

        /*
        setMapList({...dict})
        setMapList(dict)

        console.log(mapList)
        */
    }

    //const { selectedItems } = this.state;
    const filteredOptions = userList.filter(o => !selectedItems.includes(o));
        return (
          <Select
            mode="multiple"
            placeholder="None"
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


