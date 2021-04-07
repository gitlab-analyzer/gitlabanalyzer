import React, { useState, createContext } from 'react';

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [repo, setRepo] = useState(null);
  const [incorrect, setIncorrect] = useState(false);
  const [selectUser, setSelectUser] = useState('');
  const [commitsList, setCommitsList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const [mergeRequestList, setMergeRequestList] = useState({});
  const [commentsList, setCommentsList] = useState({});
  const [selectMembersList, setSelectMembersList] = useState([]);
  const [overviewScore, setOverviewScore] = useState({});
  const [dataList, setDataList] = useState([]);
  const [anon, setAnon] = useState('');
  const [floatScores, setFloatScores] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [batchList, setBatchList] = useState([]);
  const [currentConfig, setCurrentConfig] = useState({});
  const [reList, setReList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [value, setValue] = useState('');
  const [codeDiffId, setCodeDiffId] = useState('');
  const [codeDrawer, setCodeDrawer] = useState(false);

  const authContextValue = {
    user,
    setUser,
    repo,
    setRepo,
    incorrect,
    setIncorrect,
    selectUser,
    setSelectUser,
    commitsList,
    setCommitsList,
    membersList,
    setMembersList,
    usersList,
    setUsersList,
    notesList,
    setNotesList,
    mergeRequestList,
    setMergeRequestList,
    commentsList,
    setCommentsList,
    selectMembersList,
    setSelectMembersList,
    overviewScore,
    setOverviewScore,
    anon,
    setAnon,
    floatScores,
    setFloatScores,
    dataList,
    setDataList,
    selectedRepo,
    setSelectedRepo,
    batchList,
    setBatchList,
    currentConfig,
    setCurrentConfig,
    reList,
    setReList,
    filteredList,
    setFilteredList,
    value,
    setValue,
    codeDiffId,
    setCodeDiffId,
    codeDrawer,
    setCodeDrawer,
  };
  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
