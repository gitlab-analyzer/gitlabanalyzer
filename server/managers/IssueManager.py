from typing import Union, Optional, List, Tuple
from gitlab.v4.objects import ProjectIssue
from server.models.Issue import Issue

class IssueManager:
    def __init__(self, gitlab_issue_list: list) -> None:
        self.__issue_list: List[Issue] = []

        for issue in gitlab_issue_list:
            self.__add_issue(issue)

    def __add_issue(self, gitlab_issue: ProjectIssue) -> None:
        newIssue = Issue(gitlab_issue)
        self.__issue_list.append(newIssue)

    def find_issue_by_iid(self, iid: int) -> Optional[Issue]:
        # linear search
        for issue in self.__issue_list:
            if issue.issue_id == iid:
                return issue
        return None
