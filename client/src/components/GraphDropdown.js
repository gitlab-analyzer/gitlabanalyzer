import React from 'react'
import Select from 'react-select'


const dropdownOptions = [
    {value: 'commits', label: 'Commits'},
    {value: 'merge_requests', label: 'Merge Requests'},
    {value: 'issues_cr', label: 'Issues & Code Reviews'},
]

const customStyles = {
    root: {
        fontFamily: 'Comfortaa',
    },
    control: base => ({
      ...base,
      fontSize: 16,
      height: 20,
    }),
    menu: base => ({
      ...base,
      fontSize: 16,
    })
  };
  
const GraphDropdown = () => {
    return (
        <div>
            <Select options={dropdownOptions}
            styles={customStyles} />
        </div>
    )
}

export default GraphDropdown
