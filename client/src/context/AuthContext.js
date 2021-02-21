import React, { useState, createContext } from 'react';

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [repo, setRepo] = useState(null);
  const [incorrect, setIncorrect] = useState(false);
  const [selectUser, setSelectUser] = useState('@everyone');
  const [overview, setOverview] = useState([]);
  const [commitsList, setCommitsList] = useState([]);

  const authContextValue = {
    user,
    setUser,
    repo,
    setRepo,
    incorrect,
    setIncorrect,
    selectUser,
    setSelectUser,
    overview,
    setOverview,
    commitsList,
    setCommitsList,
  };
  return <AuthContext.Provider value={authContextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
