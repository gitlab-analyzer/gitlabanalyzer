from typing import Union, Optional, List
import gitlab
import re

class MergeRequest:
    def __init__(self, mr: gitlab) -> None:
        self.__id = int = mr.id
        self.__iid: int = mr.iid
        self.__author: int = mr.author['id']
        self.__title: str = mr.title
        self.__description: str = mr.description
        self.__state: str = mr.state
        self.__created_date: str = mr.created_at
        self.__related_issue_iid: Optional[int] = self.parseRelatedIssueIID(mr.description)

        if mr.state == "merged":
            self.__merged_by: Optional[int] = mr.merged_by['id'] #person who merged the MergeRequest
        else:
            self.__merged_by: Optional[int] = None #merge request is not merged
        
        self.__merged_date: Optional[str] = mr.merged_at
        self.__comments: Optional[List[str]] = None


    def parseRelatedIssueIID(self, description) -> int: 
        substring = "Closes #"
        if substring in description:
            temp = description[description.index(substring) + len(substring):]
            iid = re.search('[0-9]+', temp).group()
            if iid.isnumeric():
                return int(iid)
            return None #there is no related issue for this merge request
        return None

    def to_json(self) -> str:
        return self.__dict__.__str__().replace("_MergeRequest__", "").replace("'", '"')

    def __str__(self) -> str:
        return str(self.__dict__)

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


