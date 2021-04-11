from model.code_diff import CodeDiff
from model.data_object import DataObject
import gitlab
from typing import Union, Optional, List


class Commit(DataObject):
    def __init__(
        self,
        commit: gitlab = None,
        codeDiffID: int = -1,
        direct_to_master: bool = False,
    ) -> None:
        self.__id: int = commit.id
        self.__short_id: int = commit.short_id
        self.__title: str = commit.title
        self.__author_name: str = commit.author_name
        self.__org_author: str = commit.author_name
        self.__web_url: str = commit.web_url
        self.__committer_name: str = commit.committer_name
        self.__code_diff_id: int = codeDiffID
        self.__committed_date: str = (
            commit.committed_date
        )  # datetime in ISO 8601 format
        self.__line_counts: dict = {}
        self.__direct_to_master: bool = direct_to_master
        self.__code_diff_detail: list = []

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    # Getters
    @property
    def code_diff_id(self) -> int:
        return self.__code_diff_id

    @property
    def web_url(self) -> str:
        return self.__web_url

    @property
    def id(self) -> Union[int, str]:
        return self.__id

    @property
    def short_id(self) -> Union[int, str]:
        return self.__short_id

    @property
    def author_name(self) -> str:
        return self.__author_name

    @property
    def committer_name(self) -> str:
        return self.__committer_name

    @property
    def title(self) -> str:
        return self.__title

    @property
    def committed_date(self) -> str:
        return self.__committed_date

    @property
    def line_counts(self) -> dict:
        return self.__line_counts

    @property
    def direct_to_master(self) -> bool:
        return self.__direct_to_master

    @property
    def code_diff_detail(self) -> list:
        return self.code_diff_detail

    @property
    def org_author(self) -> str:
        return self.__org_author

    # Setter
    @code_diff_id.setter
    def code_diff_id(self, codeDiffID: int) -> None:
        self.__code_diff_id = codeDiffID

    @line_counts.setter
    def line_counts(self, lineCounts) -> None:
        self.__line_counts = lineCounts

    @author_name.setter
    def author_name(self, authorName) -> None:
        self.__author_name = authorName

    @direct_to_master.setter
    def direct_to_master(self, directly_to_master: bool) -> None:
        self.__direct_to_master = directly_to_master

    @code_diff_detail.setter
    def code_diff_detail(self, codeDiffDetail: list) -> None:
        self.__code_diff_detail = codeDiffDetail
