from model.data_object import DataObject
from typing import Optional, List
import gitlab
import re


class MergeRequest(DataObject):
    def __init__(self, mr: gitlab) -> None:
        self.__id = int = mr.id
        self.__iid: int = mr.iid
        self.__author: int = mr.author["id"]
        self.__title: str = mr.title
        self.__description: str = mr.description
        self.__state: str = mr.state
        self.__created_date: str = mr.created_at
        self.__related_issue_iid: Optional[int] = self.parse_related_issue_iid(
            mr.description
        )
        if mr.state == "merged":
            self.__merged_by: Optional[int] = mr.merged_by["id"]
        else:  # merge request is not merged
            self.__merged_by: Optional[int] = None
        self.__merged_date: Optional[str] = mr.merged_at
        self.__comments: Optional[List[str]] = None
        # self.__related_commits_sha: List[str] = commits_list

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    def parse_related_issue_iid(self, description) -> int:
        substring = "Closes #"
        if substring in description:
            tempIndex = description.index(substring) + len(substring)
            temp = description[tempIndex:]
            iid = re.search("[0-9]+", temp).group()
            if iid.isnumeric():
                return int(iid)
            return None  # there is no related issue for this merge request
        return None

    # Getters

    @property
    def id(self) -> int:
        return self.__id

    @property
    def iid(self) -> int:
        return self.__iid

    @property
    def author(self) -> int:
        return self.__author

    @property
    def title(self) -> str:
        return self.__title

    @property
    def description(self) -> str:
        return self.__description

    @property
    def state(self) -> str:
        return self.__state

    @property
    def created_date(self) -> str:
        return self.__created_date

    @property
    def related_issue_iid(self) -> Optional[int]:
        return self.__related_issue_iid

    @property
    def merged_by(self) -> Optional[int]:
        return self.__merged_by

    @property
    def merged_date(self) -> Optional[str]:
        return self.__merged_date

    @property
    def comments(self) -> Optional[List[str]]:
        return self.__comments

    def set_comments(self, commentList: List[str]):
        self.__comments = commentList
