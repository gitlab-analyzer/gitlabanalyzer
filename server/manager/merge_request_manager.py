from copy import deepcopy
from typing import Union, List
import datetime
from dateutil import parser
from interface.gitlab_interface import GitLab
from model.commit import Commit
from model.merge_request import MergeRequest
import gitlab


class MergeRequestManager:
    def __init__(self) -> None:
        self.__mergeRequestList: list = []

    @property
    def merge_request_list(self) -> list:
        return self.__mergeRequestList

    def add_merge_request(
        self, mergeRequest: gitlab, commits_list: List[Commit]
    ) -> MergeRequest:
        newMR = MergeRequest(mergeRequest, commits_list)
        self.__mergeRequestList.append(newMR)
        return newMR

    def get_merge_request_by_id(self, myId) -> Union[MergeRequest, None]:
        for mergeRequest in self.__mergeRequestList:
            if mergeRequest.id == myId:
                return mergeRequest
        return None

    def get_merge_request_by_iid(self, myIid) -> Union[MergeRequest, None]:
        for mergeRequest in self.__mergeRequestList:
            if mergeRequest.iid == myIid:
                return mergeRequest
        return None

    def get_merge_requests_by_range(self, startDate, endDate) -> list:
        myStartDate: datetime = parser.parse(startDate)
        myEndDate: datetime = parser.parse(endDate)
        tempMergeRequestList: list = []
        for mergeRequest in self.__mergeRequestList:
            tempStartDate = mergeRequest.created_date
            if myStartDate <= tempStartDate <= myEndDate:
                tempMergeRequestList.append(mergeRequest)
        return tempMergeRequestList
