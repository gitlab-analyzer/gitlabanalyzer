import json
from typing import Union, Optional, List
from model.commit import *
import gitlab
from datetime import datetime
from dateutil import parser


class CommitManager:
    def __init__(self) -> None:
        self.__commitList: List[Commit] = []

    def get_commit_list(self) -> list:
        return self.__commitList

    def get_commit_list_json(self):
        myList = []
        for commit in self.__commitList:
            myList.append(commit.to_dict())
        return myList

    def add_commit(self, commit: gitlab) -> None:
        test = Commit(commit)
        self.__commitList.append(test)

    def get_commit_by_id(self, ID) -> Union[Commit, None]:
        for commit in self.__commitList:
            if commit.id == ID:
                return commit
        return None

    def get_commits_by_userid(self, userID) -> Union[List[Commit], None]:
        listCommits = []
        for commit in self.__commitList:
            if commit.author == userID:
                listCommits.append(commit)
        return listCommits

    def get_commits_by_range(self, startDate, endDate) -> Union[List[Commit], None]:
        listTimeRange = []
        start = parser.parse(startDate)
        end = parser.parse(endDate)
        for commit in self.__commitList:
            tempDate = datetime.strptime(
                commit.committed_date, "%Y-%m-%dT%H:%M:%S.%f%z"
            )
            if start <= tempDate <= end:
                listTimeRange.append(commit)
        return listTimeRange

    def get_number_of_commits(self) -> int:
        return len(self.__commitList)
