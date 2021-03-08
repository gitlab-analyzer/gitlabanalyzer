from interface.gitlab_interface import GitLab
from manager.comment_manager import CommentManager
from manager.commit_manager import CommitManager
from manager.member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager
from manager.issue_manager import IssueManager
from model.merge_request import MergeRequest
from model.commit import Commit


class GitLabProject:
    def __init__(self, myGitlab: GitLab, projectID: int):
        self.__gitlab: GitLab = myGitlab
        self.__gitlab.set_project(projectID=projectID)
        self.__membersManager: MemberManager = MemberManager()
        self.__issuesManager: IssueManager = IssueManager()
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()
        self.__user_list: list = []
        self.__projectID: int = projectID
        self.__gitlab: GitLab = myGitlab

        self.__update_managers()

    def __update_managers(self):
        self.__update_comment_manager()
        self.__update_merge_request_manager()
        self.__update_member_manager()
        self.__update_commits_manager()
        self.__update_issues_manager()

    def __update_comment_manager(self):
        # TODO: This needs to be discussed
        # https://python-gitlab.readthedocs.io/en/stable/gl_objects/notes.html
        pass

    def __update_merge_request_manager(self):
        mergeRequests, _ = self.__gitlab.get_merge_requests_and_commits(state="all")
        for mergeRequest in mergeRequests:
            self.__mergeRequestManager.add_merge_request(mergeRequest)

    def __update_member_manager(self):
        members: list = self.__gitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)
        pass

    def __update_commits_manager(self):
        commitList: list = self.__gitlab.get_commit_list_for_project()
        tempUserSet: set = set()
        for commit in commitList:
            # Get all git users, set will only store unique values
            tempUserSet.add(commit.author_name)
            self.__commitsManager.add_commit(commit)
        self.__user_list = list(tempUserSet)

    def __update_issues_manager(self):
        issueList: list = self.__gitlab.get_issue_list()
        self.__issuesManager.populate_issue_list(issueList)

    def __get_members_and_user_names(self):
        member_and_user_list: set = set()
        for member in self.member_manager.get_member_list():
            member_and_user_list.add(member.username)
        for user in self.__user_list:
            member_and_user_list.add(user)
        return list(member_and_user_list)

    def __initialize_member_and_user_list(self, name_list: list):
        commitListsForAllUsers = []

        for user in name_list:
            commitListsForAllUsers.append(
                {
                    "user_name": user,
                    "commits": []
                }
            )
        return commitListsForAllUsers

    def get_commits_for_all_users(self):
        member_and_user_list: list = self.__get_members_and_user_names()
        commitListsForAllUsers: list = \
            self.__initialize_member_and_user_list(member_and_user_list)

        for commit in self.__commitsManager.get_commit_list():
            for user in commitListsForAllUsers:
                if user["user_name"] == commit.author_name:
                    user["commits"].append(commit.to_dict())
                    break
        return commitListsForAllUsers

    def get_merge_request_and_commit_list(self):
        mergeRequestForAllUsers = []
        mrs, commits_lists = self.__gitlab.get_merge_requests_and_commits()
        for mr, commits in zip(mrs, commits_lists):
            mr = MergeRequest(mr)
            data = mr.to_dict()
            commitList = []
            for commit in commits:
                commit = Commit(commit)
                commitList.append(commit.to_dict())
            data["commit_list"] = commitList
            mergeRequestForAllUsers.append(data)
        return mergeRequestForAllUsers

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

    @property
    def project_id(self) -> int:
        return self.__projectID

    @property
    def user_list(self) -> list:
        return self.__user_list
