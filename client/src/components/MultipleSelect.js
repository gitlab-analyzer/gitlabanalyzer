import React, { useEffect, useState } from "react";
import { Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';

// this version
const MultipleSelect = (props) => {
    const {
        usersList,
        mapList, setMapList,
    } = useAuth();

    const [selectedItems, setSelectedItems] = useState([]);
    const [newSelectedItems, setNewSelectedItems] = useState();
    // const userList = ["User1", "User2", "User3", "User4", "User5", "User6"];
    const userList = usersList;     // real data
    const dict = {};
    const [dictionary, setDictionary] = useState({});
    
    function handleChange(value) {
        setSelectedItems(value)
        // console.log(props.currentMember)

        // var dict = {};
        
        // this!
        dict[props.currentMember] = value;
        console.log(dict);

        // setDictionary({...dictionary, dict})
        // console.log(dictionary)
        
        // setMapList(oldList => ({...oldList, dict}));  // this!
        setMapList({...mapList, dict})
        // setMapList(dict)
        // console.log(mapList)
    }

    useEffect( () => {
        console.log("helloooooooo")
        // setMapList(oldList => ({...oldList, dictionary})); 
    }, [dictionary])

    function addToDictionary() {
        
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


