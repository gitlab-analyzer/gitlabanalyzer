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
        self.__update_merge_request_manager()
        self.__update_member_manager()
        self.__update_commits_manager()
        self.__update_issues_manager()
    
    def update_merge_request_manager(self):
        mergeRequests, commitsForMR = self.__gitlab.get_merge_requests_and_commits(
            state="all"
        )
        
        for i in range(0, len(mergeRequests)):
            self.__mergeRequestManager.add_merge_request(
                mergeRequests[i], commitsForMR[i]
            )
            # Get comments
            mr_notes = self.__gitlab.get_comments_of_mr(mergeRequests[i].iid)
            for item in mr_notes:
                if item.system is False:
                    self.__commentsManager.add_comment(item)

    def __update_member_manager(self):
        members: list = self.__gitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)

    def update_commits_manager(self):
        commitList: list = self.__gitlab.get_commit_list_for_project()
        for commit in commitList:
            self.__commitsManager.add_commit(commit)

            # Get comments
            commit_notes = self.__gitlab.get_comments_of_commit(
                commit.short_id
            )  

            for item in commit_notes:
                self.__commentsManager.add_comment(item, commit.short_id)

    def update_issues_manager(self):
        issueList: list = self.__gitlab.get_issue_list()
        self.__issuesManager.populate_issue_list(issueList)

        # Get comments
        for issue in issueList:
            issue_notes = self.__gitlab.get_comments_of_issue(issue.iid)

            for item in issue_notes:
                if item.system is False:
                    self.__commentsManager.add_comment(item)

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
    def issue_manager(self):
        return self.__issuesManager

    @property
    def project_id(self) -> int:
        return self.__projectID
