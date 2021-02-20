import gitlab
from typing import Union, Optional, List


class Commit:
    def __init__(self, commit: gitlab = None) -> None:
        self.__id: int = commit.id
        self.__title: str = commit.title
        self.__author_name: str = commit.author_name
        self.__committer_name: str = commit.committer_name
        self.__committed_date: str = (
            commit.committed_date
        )  # datetime in ISO 8601 format

    def to_json(self) -> str:
        return self.__dict__.__str__().replace("_Commit__", "").replace("'", '"')

    def __str__(self) -> str:
        return self.__dict__.__str__()

    # Getters

    @property
    def id(self) -> Union[int, str]:
        return self.__id

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

