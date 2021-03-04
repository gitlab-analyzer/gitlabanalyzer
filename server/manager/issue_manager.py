from typing import Union, Optional, List, Tuple
from model.issue import Issue
from datetime import datetime
from dateutil import parser


class IssueManager:
    def __init__(self) -> None:
        self.__issue_list: List[Issue] = []

    def populate_issue_list(self, gitlab_issue_list: list):
        for issue in gitlab_issue_list:
            newIssue = Issue(issue)
            self.__issue_list.append(newIssue)

    def get_issue_by_iid(self, iid: int) -> Optional[Issue]:
        # linear search
        for issue in self.__issue_list:
            if issue.issue_id == iid:
                return issue
        return None

    def get_issues_by_author_id(self, author_id: int) -> Tuple[Issue]:
        issueSubList = []
        for issue in self.__issue_list:
            if issue.author_id == author_id:
                issueSubList.append(issue)
        return tuple(issueSubList)

    def get_issues_by_date_range(
        self, start_date: Optional[str] = None, end_date: Optional[str] = None
    ) -> Tuple[Issue]:
        startDate: Optional[datetime] = (
            parser.parse(start_date) if start_date is not None else None
        )
        endDate: Optional[datetime] = (
            parser.parse(end_date) if end_date is not None else None
        )
        issueSubList = []
        for issue in self.__issue_list:
            issueCreationDate = parser.isoparse(issue.created_date)
            if (startDate is None or issueCreationDate >= startDate) and (
                endDate is None or issueCreationDate <= endDate
            ):
                issueSubList.append(issue)
        return tuple(issueSubList)

    def __str__(self) -> str:
        string = "["
        for issue in self.__issue_list:
            string += "<Issue iid:{}>,".format(issue.issue_id)
        if string[-1] == ',':
            string = string[:-1]
        string += "]"
        return string
