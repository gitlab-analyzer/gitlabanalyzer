from typing import Union, Optional, List
from model.Member import *
import gitlab
from datetime import datetime
from dateutil import parser


class MemberManager:
    def __init__(self) -> None:
        self.__memberList: List[member] = []

    def getMemberList(self) -> list:
        return self.__memberList

    def add_member(self, member: gitlab) -> None:
        self.__memberList.append(Member(member))

    def get_member_by_id(self, ID) -> Union[Member, None]:
        for member in self.__memberList:
            if member.id == ID:
                return member
        return None

    def get_number_of_members(self) -> int:
        return len(self.__memberList)
