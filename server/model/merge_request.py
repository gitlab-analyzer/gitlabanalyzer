from model.commit import Commit
from model.data_object import DataObject
from typing import Optional, List
import gitlab
import re


class MergeRequest(DataObject):
    def __init__(
        self, mr: gitlab, commits_list: List[Commit], codeDiffID: int = -1
    ) -> None:
        self.__id: int = mr.id
        self.__iid: int = mr.iid
        self.__author: int = mr.author
        self.__title: str = mr.title
        self.__web_url: str = mr.web_url
        self.__description: str = mr.description
        self.__state: str = mr.state
        self.__created_date: str = mr.created_at
        self.__related_issue_iid: Optional[int] = self.parse_related_issue_iid(
            mr.description
        )
        self.__code_diff_id: int = codeDiffID
        if mr.state == "merged":
            self.__merged_by: Optional[int] = mr.merged_by["id"]
        else:  # merge request is not merged
            self.__merged_by: Optional[int] = None
        self.__merged_date: Optional[str] = mr.merged_at
        self.__comment_iid_list: List[int] = []
        self.__related_commits_list: List[Commit] = []
        self.__line_counts: dict = {}
        self.__code_diff_detail: list = []
        self.__add_commits_list(commits_list)

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    def __add_commits_list(self, commitList: List[Commit]) -> None:
        for commit in commitList:
            self.__related_commits_list.append(Commit(commit))

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
    def web_url(self) -> str:
        return self.__web_url

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
    def comment_iid_list(self) -> Optional[List[str]]:
        return self.__comment_iid_list

    @property
    def related_commits_list(self) -> List[Commit]:
        return self.__related_commits_list

    @property
    def code_diff_id(self) -> int:
        return self.__code_diff_id

    @property
    def line_counts(self) -> dict:
        return self.__line_counts

    @property
    def code_diff_detail(self) -> list:
        return self.code_diff_detail

    @line_counts.setter
    def line_counts(self, lineCounts) -> None:
        self.__line_counts = lineCounts

    @code_diff_id.setter
    def code_diff_id(self, codeDiffID: int) -> None:
        self.__code_diff_id = codeDiffID

    def add_comment(self, comment_iid: int):
        self.__comment_iid_list.append(comment_iid)

    def set_comments(self, commentList: List[str]):
        self.__comments = commentList

    @code_diff_detail.setter
    def code_diff_detail(self, codeDiffDetail: list) -> None:
        self.__code_diff_detail = codeDiffDetail
