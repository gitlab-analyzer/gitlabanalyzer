import gitlab
from typing import Union, Tuple

str_none = Union[str, None]
list_none = Union[list, None]

"""
IMPORTANT: Please use the following steps to use the interface

myGitLab = GitLab(token="your_token_here")
auth_status = myGitLab.auth() # will return true if auth successfully, false otherwise
project_list = myGitLab.get_project_list()

# Then find and set the project you want to work with
myGitLab.set_project(project_id)
# Then you can call "get_issues" or other functions
...

# Once you are done, call "set_project" again
myGitLab.set_project(project_id)
...

"""

"""
By default GitLab does not return the complete list of items. 
Use the all parameter to get all the items when using listing methods:
Ex: all_groups = gl.groups.list(all=True)
"""


class GitLab:
    def __init__(self, token, url=None) -> None:
        self.__token: str = token
        self.__project_lists: list_none = None
        self.__url: str_none = None
        self.__project: Union[gitlab, None] = None
        if (url is None) or (url is ''):
            self.__url = "https://csil-git1.cs.surrey.sfu.ca/"
        else:
            self.__url = url
        self.gl: gitlab = gitlab.Gitlab(self.__url, self.__token)

    def __find_project(self, projectID: int) -> Union[object, None]:
        for project in self.__project_lists:
            if project.id == projectID:
                return project
        return None

    def get_username(self) -> str:
        userList: gitlab = self.gl.namespaces.list()
        for user in userList:
            if user.kind == 'user':
                return user.name

    def get_all_members(self) -> list:
        return self.__project.members.list()

    def set_project(self, projectID: int) -> None:
        self.__project = self.__find_project(projectID)

    def authenticate(self) -> bool:
        try:
            self.gl.auth()
        except:
            return False
        return True

    def get_project_list(self) -> list:
        if not self.__project_lists:
            self.__project_lists = self.gl.projects.list(visibility='private')
        return self.__project_lists

    def get_commit_list_for_project(self) -> list_none:
        return self.__project.commits.list(all=True)

    # Example: since='2016-01-01T00:00:00Z'
    def get_commit_list_for_project_with_range(self, sinceDate: str, untilDate: str) -> list_none:
        return self.__project.commits.list(since=sinceDate, until=untilDate)

    # Return a list of commit diff for a project
    def get_commit_diff_list(self, sinceDate: str = None, untilDate: str = None) -> list:
        commitDiff: list = []
        if not (sinceDate and untilDate):
            commitList = self.get_commit_list_for_project()
        else:
            commitList = self.get_commit_list_for_project_with_range(
                sinceDate, untilDate)

        for oneCommit in commitList:
            commitDiff.append(oneCommit.diff())
        return commitDiff

    '''
        state: state of the MR. It can be one of all, merged, opened or closed
        order_by: sort by created_at or updated_at
        sort: sort order (asc or desc)
    '''
    # First return value: a list of merge requests
    # Ex: [mergeRequest1, mergeRequest2]
    # Second return value: a list of all commits for each merge requests
    # Ex: [[commit1, commit2], [commit1]]
    def get_merge_requests_and_commits(self, state: str = None, order_by: str = None, sort: str = None) -> Tuple[
            list, list]:
        commitsForMergeRequests: list = []
        mergeRequests = self.__project.mergerequests.list(
            state=state, order_by=order_by, sort=sort)

        for mergeRequest in mergeRequests:
            myCommits: gitlab = mergeRequest.commits()
            commitsList: list = []
            for _ in range(myCommits.total_pages):
                try:
                    commitsList.append(myCommits.next())
                except StopIteration:
                    pass
            commitsForMergeRequests.append(commitsList)
        return mergeRequests, commitsForMergeRequests

    def get_issue_list(self, status: str = None) -> list:
        project = self.__project
        return project.issues.list(status=status, all=True)

    # A list of note list for each issue
    def get_issue_comments_list(self) -> list:
        issueCommentsList: list = []
        for issue in self.get_issue_list():
            issueCommentsList.append(issue.notes.list())
        return issueCommentsList

    def get_merge_request_comment_list(self) -> list:
        mergeRequestCommentsList: list = []
        mergeRequestList, _ = self.get_merge_requests_and_commits()
        for mergeRequest in mergeRequestList:
            mergeRequestCommentsList.append(mergeRequest.notes.list())
        return mergeRequestCommentsList

    def get_specific_mr(self, mr_iid:Union[str, int]) -> list:
        project = self.__project
        return project.mergerequests.get(mr_iid)

    def get_specific_issue(self, issue_iid:int) -> list:
        project = self.__project
        return project.issues.get(issue_iid)

    def get_specific_commit(self, commit_sha:str) -> list:
        project = self.__project
        return project.commits.get(commit_sha)



