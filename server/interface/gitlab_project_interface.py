import gitlab
from interface.gitlab_interface import GitLab
from manager.CommentManager import CommentManager
from manager.Commit_manager import CommitManager
from manager.Member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager


class GitlabProject:
    def __init__(self, myGitlab: gitlab):
        self.__membersManager: MemberManager = MemberManager()
        # self.__issuesManager
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()
        self.__gitlab: GitLab = myGitlab

    def set_project(self, projectID: int):
        self.__gitlab.set_project(projectID=projectID)
        self.__update_managers()

    def __update_managers(self):
        self.__update_comment_manager()
        self.__update_merge_request_manager()
        self.__update_member_manager()
        self.__update_commits_manager()
        self.__update_issues_manager()
        pass

    def __update_comment_manager(self):
        # TODO: This needs to be discussed
        # https://python-gitlab.readthedocs.io/en/stable/gl_objects/notes.html
        pass

    def __update_merge_request_manager(self):
        mergeRequests, _ = self.__gitlab.get_merge_requests_and_commits(state='all')
        for mergeRequest in mergeRequests:
            self.__mergeRequestManager.add_merge_request(mergeRequest)

    def __update_member_manager(self):
        members: list = self.__gitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)
        pass

    def __update_commits_manager(self):
        commitList: list = self.__gitlab.get_commit_list_for_project()
        for commit in commitList:
            self.__commitsManager.add_commit(commit)

    def __update_issues_manager(self):
        issueList: list = self.__gitlab.get_issue_list()
        for issue in issueList:
            # TODO: add issue to issueManager
            pass
        pass

    @property
    def project_list(self) -> list:
        return self.__gitlab.get_project_list()

    @property
    def member_manager(self) -> MemberManager:
        return self.__membersManager

    @property
    def merge_request_manager(self) -> MergeRequestManager:
        return self.__mergeRequestManager

    @property
    def commits_manager(self) -> CommitManager:
        return self.__commitsManager

# gl = GitLab(token='Cy2V5TYVWRwmwf9trh-X', url='https://csil-git1.cs.surrey.sfu.ca/')
# gl.authenticate()
# gl.get_project_list()
# gl.set_project(25515)
# list = gl.get_commit_list_for_project()
