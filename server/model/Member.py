import gitlab
from typing import Union, Optional, List


class Member:
    def __init__(self, member: gitlab) -> None:
        self.__id: int = member.id
        self.__username: str = member.username
        self.__name: str = member.name
        self.__state: str = member.state
        self.__access_level: int = member.access_level

    def to_json(self) -> str:
        return self.__dict__.__str__().replace("_Member__", "").replace("'", '"')

    def __str__(self) -> str:
        return self.__dict__.__str__()

    # Getters

    @property
    def id(self) -> Union[int, str]:
        return self.__id

    @property
    def username(self) -> str:
        return self.__username

    @property
    def name(self) -> str:
        return self.__name

    @property
    def state(self) -> str:
        return self.__state

    @property
    def access_level(self) -> int:
        return self.__access_level
