import React, { useEffect, useState } from "react";
import { Button, Select } from 'antd';
import { useAuth } from '../context/AuthContext';
import './UserMap.css';
import MultipleSelect from '../components/MultipleSelect'
import MembersList from './MembersList'
import { Redirect } from 'react-router';
import fetchMergeRequests from './login/Repo'
import fetchCommits from './login/Repo'
import axios from 'axios';

const { Option } = Select;

const UserMap = () => {
    const {
        membersList,
        usersList,
        selectedRepo,
        mergeRequestList,
        setMergeRequestList,
        commitsList,
        setCommitsList,
        mapList, setMapList,
        selectedOptions, 
    } = useAuth();
    const [redirect, setRedirect] = useState(false);
    const [mappingDictionary, setMappingDictionary] = useState("");

    const memberList = ["MemberA", "MemberB", "MemberC", "MemberD"]; // fake data
    // const memberList = membersList.map((item) => item.name);    // real data
    const userList = usersList.filter(val => !memberList.includes(val));
    
    
    const MemberList = ({ list }) => (
        <ul className="allList">
          {list.map(item => (
            <li className="innerList" key={item}>
                <div className="listForMembers">
                    {item}
                </div>
                <MultipleSelect key={item} id={item} currentMember={item}/>
            </li>
          ))}
        </ul>
    );
    
    // const mapDictionary = JSON.stringify({ "Administrator": ["jiwonj", "jaddiet", "xtran"] }); 
    // const mapDictionary = JSON.stringify(mapList);

    let mapDict = {}
    // mapDict["user_mapping"] = { "Administrator": ["jiwonj", "jaddiet", "xtran"] } // mapList
    mapDict["user_mapping"] = mapList;
    let finalDict = JSON.stringify(mapDict);

    const proceedMapping = async () => {
        // var mapDictionary = JSON.stringify(mapList);
        setMappingDictionary(mapList);
        // console.log(selectedRepo)
        // console.log(mapDictionary)
        // console.log(selectedOptions.length)
        console.log(mapList);
        console.log(mapDict);
        console.log(finalDict);

        try {
            await mapUsers();
            // Call commitsList mergeRequestList again since the data have been changed.
            await fetchCommits();
            await fetchMergeRequests();
        } catch (error) {
            console.log(error);
        }

        // this verison!
        /*
        if (selectedOptions.length !== 0) {  // if there is at least one committer to be mapped
            try {
                await mapUsers();
                // Call commitsList mergeRequestList again since the data have been changed.
                // await fetchCommits();
                // await fetchMergeRequests();
            } catch (error) {
                console.log(error);
            }
        }
        */
        setRedirect(true)
    }

    // POST call to backend 
    const mapUsers = async () => {
        const userMappingRes = await axios.post(
            `http://localhost:5678/projects/${selectedRepo}/map`,
            finalDict,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                crossorigin: true,
                crossDomain: true,
            }
        );
    
    };



    /*
    const fetchCommits = async () => {
        const commitsRes = await axios.get(
          `http://localhost:5678/projects/${selectedRepo}/commit/user/all`,
          {
            withCredentials: true,
          }
        );
        fetchErrorChecker(commitsRes.data['response'], 'commits');
    
        const tempCommits = commitsRes.data['commit_list'].map((commit) => ({
          userName: commit.user_name,
          commits: [
            commit.commits.map((innerCommit) => ({
              authorName: innerCommit.author_name,
              codeDiffId: innerCommit.code_diff_id,
              commitedDate: new Date(innerCommit.committed_date),
              commiterName: innerCommit.committer_name,
              id: innerCommit.id,
              lineCounts: {
                ...innerCommit.line_counts,
              },
              shortId: innerCommit.short_id,
              title: innerCommit.title,
              webUrl: innerCommit.web_url,
            })),
          ],
        }));
        setCommitsList([...tempCommits]);
      };
    
      // Function for fetching, parsing, and storing merge requests list data
      const fetchMergeRequests = async () => {
        const mergeRequestRes = await axios.get(
          `http://localhost:5678/projects/${selectedRepo}/merge_request/user/all`,
          {
            withCredentials: true,
          }
        );
        // console.log(mergeRequestRes.data['merge_request_users_list']);
    
        fetchErrorChecker(mergeRequestRes.data['response'], 'merge request');
    
        // Generate a temporary merge request list to parse and set to Global Context API
        const generateTempMR = () => {
          const mrList = mergeRequestRes.data['merge_request_users_list'];
          const tempMR = {};
          // Loop through object key
          for (let user in mrList) {
            tempMR[user] = {
              mr: {},
              weightedScore: 0,
            };
            // Loop through object item
            for (let author of mrList[user]) {
              let tempCommits = {};
              for (let commit of author.commit_list) {
                tempCommits[commit.short_id] = {
                  authorName: commit.author_name,
                  codeDiffId: commit.code_diff_id,
                  comittedDate: new Date(commit.committed_date),
                  codeDiffDetail: { ...commit.code_diff_detail },
                  committerName: commit.committer_name,
                  id: commit.id,
                  relatedMr: author.id,
                  lineCounts: commit.line_counts,
                  shortId: commit.short_id,
                  title: commit.title,
                  webUrl: commit.web_url,
                  // Frontend defined variables Start --------------------------
                  // Initial score calculation
                  score:
                    commit.line_counts.lines_added +
                    commit.line_counts.lines_deleted * 0.1,
                  // Flag to ignore this commit
                  ignore: false,
                  omitScore: 0,
                  // Frontend defined variables End --------------------------
                };
              }
              tempMR[user].mr[author.id] = {
                author: author.author,
                codeDiffId: author.code_diff_id,
                comments: author.comments,
                codeDiffDetail: { ...author.code_diff_detail },
                commitList: tempCommits,
                createdDate: new Date(author.created_date),
                description: author.description,
                id: author.id,
                iid: author.iid,
                lineCounts: author.line_counts,
                mergedBy: author.merged_by,
                mergedDate: new Date(author.merged_date),
                relatedIssueIid: author.related_issue_iid,
                state: author.state,
                title: author.title,
                webUrl: author.web_url,
                // Frontend defined variables Start --------------------------
                // Initial score calculation
                score:
                  author.line_counts.lines_added +
                  author.line_counts.lines_deleted * 0.1,
                // Flag to ignore this MR
                ignore: false,
                omitScore: 0,
                // Frontend defined variables End --------------------------
              };
            }
          }
          console.log('tempMR', tempMR);
          return tempMR;
        };
        setMergeRequestList(generateTempMR());
      };

      const fetchErrorChecker = (res, dataType) => {
        if (!res) {
          console.log(`Failed to retrieve ${dataType} list!`);
          throw new Error('Fetch request failed.');
        }
      };
      */










    if (redirect) {
        return <Redirect to="/summary" />;
    } else {
        return(
            <div className="MapContainer">
                <div className="intro">
                    <b1>* { userList.length } committers are not identified as members. Please complete the mapping.</b1>
                    <div className="columnNames">
                        <p>Member</p>
                        <p>Committer</p>
                    </div>
                </div>
    
                <div className="lists">
                    <MembersList list={memberList} />
                </div>
    
                <div className="button">
                    <Button type="primary" onClick={proceedMapping} setRedirect={setRedirect}>Proceed</Button>
                </div>
                
            </div>
        );
    }

}

export default UserMap

