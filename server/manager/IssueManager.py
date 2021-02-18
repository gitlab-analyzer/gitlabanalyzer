from typing import Union, Optional, List, Tuple
from server.model.Issue import Issue

class IssueManager:
    def __init__(self, gitlab_issue_list: list) -> None:
        self.__issue_list: List[Issue] = []

        for issue in gitlab_issue_list:
            newIssue = Issue(issue)
            self.__issue_list.append(newIssue)

    def get_issue_by_iid(self, iid: int) -> Optional[Issue]:
        # linear search
        for issue in self.__issue_list:
            if issue.issue_id == iid:
                return issue
        return None

    def __str__(self) -> str:
        string = "["
        for issue in self.__issue_list:
            string += "<Issue iid:{}>,".format(issue.issue_id)
        if string[-1] == ',':
            string = string[:-1]
        string += "]"
        return string