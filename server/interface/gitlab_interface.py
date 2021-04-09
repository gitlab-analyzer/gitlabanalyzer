import gitlab
from typing import Union, Tuple, Optional, List

from gitlab.v4.objects import Project as gl_Project

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

        self.__url: Optional[str] = url
        if (url is None) or (url == ""):
            self.__url = "https://csil-git1.cs.surrey.sfu.ca/"

        self.__project_lists: Optional[list] = None
        self.__project: Optional[gl_Project] = None

        self.gl: gitlab = gitlab.Gitlab(self.__url, self.__token)
        if self.authenticate():
            self.__project_lists = self.gl.projects.list(visibility="private")

    def find_project(self, projectID: int) -> Optional[gl_Project]:
        for project in self.__project_lists:
            if project.id == projectID:
                return project
        return None

    def get_username(self) -> str:
        userList: gitlab = self.gl.namespaces.list()
        for user in userList:
            if user.kind == "user":
                return user.name

    def get_all_members(self) -> list:
        return self.__project.members.list()

    def set_project(self, projectID: int) -> bool:
        self.__project = self.find_project(projectID)
        if self.__project is not None:
            return True
        else:
            return False

    def authenticate(self) -> bool:
        try:
            self.gl.auth()
        except gitlab.exceptions.GitlabAuthenticationError:
            return False
        return True

    def get_project_list(self) -> list:
        return self.__project_lists

    def get_commit_list_for_project(self) -> Optional[list]:
        return self.__project.commits.list(state="all", all=True)

    # Example: since='2016-01-01T00:00:00Z'
    def get_commit_list_for_project_with_range(
        self, sinceDate: str, untilDate: str
    ) -> Optional[list]:
        return self.__project.commits.list(since=sinceDate, until=untilDate)

    # Return a list of commit diff for a project
    def get_commit_diff_list(
        self, sinceDate: str = None, untilDate: str = None
    ) -> list:
        commitDiff: list = []
        if not (sinceDate and untilDate):
            commitList = self.get_commit_list_for_project()
        else:
            commitList = self.get_commit_list_for_project_with_range(
                sinceDate, untilDate
            )

        for oneCommit in commitList:
            commitDiff.append(oneCommit.diff())
        return commitDiff

    """
        state: state of the MR. It can be one of all, merged, opened or closed
        order_by: sort by created_at or updated_at
        sort: sort order (asc or desc)
    """
    # First return value: a list of merge requests
    # Ex: [mergeRequest1, mergeRequest2]
    # Second return value: a list of all commits for each merge requests
    # Ex: [[commit1, commit2], [commit1]]
    def get_merge_requests_and_commits(
        self, state: str = None, order_by: str = None, sort: str = None
    ) -> Tuple[list, list]:
        commitsForMergeRequests: list = []
        mergeRequests = self.__project.mergerequests.list(
            state=state, order_by=order_by, sort=sort, per_page=100
        )  # 100 is the maximum # of objects you can get

        for mergeRequest in mergeRequests:
            myCommits: gitlab = mergeRequest.commits()
            commitsList: list = []
            for commit in myCommits:
                try:
                    commitsList.append(commit)
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

    def get_comments_of_mr(self, mr_iid: Union[str, int]) -> list:
        mergeRequest = self.__project.mergerequests.get(mr_iid)
        return mergeRequest.notes.list()

    def get_comments_of_issue(self, issue_iid: int) -> list:
        issue = self.__project.issues.get(issue_iid)
        return issue.notes.list()

    def get_comments_of_commit(self, commit_sha: str) -> list:
        commit = self.__project.commits.get(commit_sha)
        return commit.comments.list()

    def get_merge_request_code_diff_latest_version(self, mergeRequestID: int) -> list:
        mergeRequest = self.__project.mergerequests.get(mergeRequestID)
        return mergeRequest.diffs.get(mergeRequest.diffs.list()[0].id).diffs

    def get_commits_code_diff(self, commitShortID: str) -> list:
        return self.__project.commits.get(commitShortID).diff()

    def get_default_branch(self) -> str:
        branch_list = self.__project.branches.list(all=True)
        for branch in branch_list:
            if branch.default:
                return branch.name
