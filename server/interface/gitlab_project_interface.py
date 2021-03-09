from interface.gitlab_interface import GitLab
from manager.comment_manager import CommentManager
from manager.commit_manager import CommitManager
from manager.member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager
from manager.issue_manager import IssueManager


class GitLabProject:
    def __init__(self, myGitlab: GitLab, projectID: int):
        myGitlab.set_project(projectID=projectID)
        self.__membersManager: MemberManager = MemberManager()
        self.__issuesManager: IssueManager = IssueManager()
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()
        self.__projectID: int = projectID

        # This will be filled after the call to self.__update_commits_manager(myGitlab)
        self.__user_list: list = []

        self.__update_managers(myGitlab)

    def __update_managers(self, myGitlab: GitLab) -> None:
        self.__update_merge_request_manager(myGitlab)
        self.__update_member_manager(myGitlab)
        self.__update_commits_manager(myGitlab)
        self.__update_issues_manager(myGitlab)

    def __update_merge_request_manager(self, myGitlab: GitLab) -> None:
        mergeRequests, commitsForMR = myGitlab.get_merge_requests_and_commits(
            state="all"
        )
        for i in range(0, len(mergeRequests)):
            self.__mergeRequestManager.add_merge_request(
                mergeRequests[i], commitsForMR[i]
            )
            # Get comments
            mr_notes = myGitlab.get_comments_of_mr(mergeRequests[i].iid)
            for item in mr_notes:
                if item.system is False:
                    self.__commentsManager.add_comment(item)

    def __update_member_manager(self, myGitlab: GitLab) -> None:
        members: list = myGitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)

    def __update_commits_manager(self, myGitlab: GitLab) -> None:
        commitList: list = myGitlab.get_commit_list_for_project()
        tempUserSet: set = set()
        for commit in commitList:
            # Get all git users, set will only store unique values
            tempUserSet.add(commit.author_name)
            self.__commitsManager.add_commit(commit)

            # Get comments
            commit_notes = myGitlab.get_comments_of_commit(commit.short_id)
            for item in commit_notes:
                self.__commentsManager.add_comment(item, commit.short_id)

        self.__user_list = list(tempUserSet)

    def __update_issues_manager(self, myGitlab: GitLab) -> None:
        issueList: list = myGitlab.get_issue_list()
        self.__issuesManager.populate_issue_list(issueList)

        # Get comments
        for issue in issueList:
            issue_notes = myGitlab.get_comments_of_issue(issue.iid)
            for item in issue_notes:
                if item.system is False:
                    self.__commentsManager.add_comment(item)

    def __get_members_and_user_names(self) -> list:
        member_and_user_list: set = set()
        for member in self.member_manager.get_member_list():
            member_and_user_list.add(member.username)
        for user in self.__user_list:
            member_and_user_list.add(user)
        return list(member_and_user_list)

    def __initialize_member_and_user_list(self) -> list:
        commitListsForAllUsers = []

        for user in self.__user_list:
            commitListsForAllUsers.append({"user_name": user, "commits": []})
        return commitListsForAllUsers

    def get_commits_for_all_users(self) -> list:
        commitListsForAllUsers: list = self.__initialize_member_and_user_list()

        for commit in self.__commitsManager.get_commit_list():
            for user in commitListsForAllUsers:
                if user["user_name"] == commit.author_name:
                    user["commits"].append(commit.to_dict())
                    break
        return commitListsForAllUsers

    def get_merge_request_and_commit_list(self) -> list:
        mergeRequestForAllUsers = []

        for mr in self.merge_request_manager.merge_request_list:
            mr = mr.to_dict()
            commitList = []
            for commit in mr["related_commits_list"]:
                commitList.append(commit.to_dict())
            mr["commit_list"] = commitList
            # delete the list of commits so jsonify won't throw error
            del mr['related_commits_list']
            mergeRequestForAllUsers.append(mr)
        return mergeRequestForAllUsers

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
    def issue_manager(self) -> IssueManager:
        return self.__issuesManager

    @property
    def project_id(self) -> int:
        return self.__projectID

    @property
    def user_list(self) -> list:
        return self.__user_list
