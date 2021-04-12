from typing import Union, Optional, List
from model.member import Member
import gitlab
from datetime import datetime
from dateutil import parser


class MemberManager:
    def __init__(self) -> None:
        self.__memberList: List[Member] = []

    def get_member_list(self) -> list:
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

    def loop_through_list(self, accessLevel, listMember) -> None:
        for member in self.__memberList:
            if member.access_level == accessLevel:
                listMember.append(member)

    def get_member_list_by_access_level(self, role) -> Union[List[Member], None]:
        listMember = []
        if role == "no access":
            self.loop_through_list(0, listMember)
            return listMember
        elif role == "minimal access":
            self.loop_through_list(5, listMember)
            return listMember
        elif role == "guest":
            self.loop_through_list(10, listMember)
            return listMember
        elif role == "reporter":
            self.loop_through_list(20, listMember)
            return listMember
        elif role == "developer":
            self.loop_through_list(30, listMember)
            return listMember
        elif role == "maintainer":
            self.loop_through_list(40, listMember)
            return listMember
        elif role == "owner":
            self.loop_through_list(50, listMember)
            return listMember
        else:
            return listMember
