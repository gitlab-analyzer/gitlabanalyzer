from interface.gitlab_interface import GitLab
from manager.comment_manager import CommentManager
from manager.commit_manager import CommitManager
from manager.member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager
from manager.issue_manager import IssueManager


class GitLabProject:
    def __init__(self, myGitlab: GitLab, projectID: int):
        self.__gitlab: GitLab = myGitlab
        self.__gitlab.set_project(projectID=projectID)

        self.__membersManager: MemberManager = MemberManager()
        self.__issuesManager: IssueManager = IssueManager()
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()
        self.__projectID: int = -1
        self.__gitlab: GitLab = myGitlab

    def set_project(self, projectID: int):
        self.__projectID = projectID
        if self.__gitlab.set_project(projectID=projectID):
            self.__update_managers()
            return True
        else:
            return False

    def __update_managers(self):
        self.__update_comment_manager()
        self.__update_merge_request_manager()
        self.__update_member_manager()
        self.__update_commits_manager()
        self.__update_issues_manager()

    def update_comment_manager(self):
        # Get comments on MR
        mrList = self.__gitlab.get_merge_requests_and_commits(state="all")[0]
        for mr in mrList:
            mergeRequest = self.__gitlab.get_specific_mr(mr.iid)
            mr_notes = self.__gitlab.get_comments_of_mr(mergeRequest)

            for item in mr_notes:
                # print(item.body)
                print(item.system)  # print for testing
                if item.system is False:
                    self.__commentsManager.add_comment(item)

        # print("\n")  # print for testing purposes

        # Get comments on Issue
        issueList = self.__gitlab.get_issue_list()
        for issue in issueList:
            anIssue = self.__gitlab.get_specific_issue(issue.iid)
            issue_notes = self.__gitlab.get_comments_of_issue(anIssue)

            for item in issue_notes:
                # print(item.body)
                print(item.system)
                if item.system is False:
                    self.__commentsManager.add_comment(item)

        # print("\n")

        # Get comments on Code Commits
        allCommits = (
            self.__gitlab.get_commit_list_for_project()
        )  # get list of all commits
        for commit in allCommits:
            aCommit = self.__gitlab.get_specific_commit(commit.short_id)
            commit_notes = self.__gitlab.get_comments_of_commit(
                aCommit
            )  # get list of all comments of a commit

            for item in commit_notes:
                # print(item.note)
                self.__commentsManager.add_comment(item, commit.short_id)

    def update_merge_request_manager(self):
        mergeRequests, commitsForMR = self.__gitlab.get_merge_requests_and_commits(
            state="all"
        )
        for i in range(0, len(mergeRequests)):
            self.__mergeRequestManager.add_merge_request(
                mergeRequests[i], commitsForMR[i]
            )

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
        self.__issuesManager.populate_issue_list(issueList)

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

    def get_comment_list(self):
        return self.__commentsManager.get_comment_list()

    def get_merge_request_list(self):
        return self.__mergeRequestManager.merge_request_list
