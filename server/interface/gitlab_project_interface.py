from copy import deepcopy
from interface.gitlab_interface import GitLab
from manager.code_diff_temp import CodeDiffAnalyzer
from manager.comment_manager import CommentManager
from manager.commit_manager import CommitManager
from manager.issue_manager import IssueManager
from manager.member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager
from model.code_diff import CodeDiff
from manager.code_diff_manager import CodeDiffManager
from model.commit import Commit
from model.merge_request import MergeRequest


class GitLabProject:
    def __init__(self, myGitlab: GitLab, projectID: int):
        myGitlab.set_project(projectID=projectID)
        self.__membersManager: MemberManager = MemberManager()
        self.__issuesManager: IssueManager = IssueManager()
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()
        self.__codeDiffManager: CodeDiffManager = CodeDiffManager()
        self.__codeDiffAnalyzer: CodeDiffAnalyzer = CodeDiffAnalyzer()
        self.__projectID: int = projectID

        # This will be filled after the call to self.__update_commits_manager(myGitlab)
        self.__user_list: list = []

        self.__update_managers(myGitlab)

    def __update_managers(self, myGitlab: GitLab) -> None:
        self.__update_merge_request_manager(myGitlab)
        # self.__update_member_manager(myGitlab)
        self.__update_commits_manager(myGitlab)
        # self.__update_issues_manager(myGitlab)
        self.__update_code_diff_manager(myGitlab)
        self.__analyze_master_commits_code_diff()
        self.__analyze_merge_requests_code_diff()

    def __update_merge_request_manager(self, myGitlab: GitLab) -> None:
        mergeRequests, commitsForMR = myGitlab.get_merge_requests_and_commits(
            state="all"
        )
        for i in range(0, len(mergeRequests)):
            self.__mergeRequestManager.add_merge_request(
                mergeRequests[i], commitsForMR[i]
            )
            # Get comments
            # mr_notes = myGitlab.get_comments_of_mr(mergeRequests[i].iid)
            # for item in mr_notes:
            #     if item.system is False:
            #         self.__commentsManager.add_comment(item)

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

            # # Get comments
            # commit_notes = myGitlab.get_comments_of_commit(commit.short_id)
            # for item in commit_notes:
            #     self.__commentsManager.add_comment(item, commit.short_id)

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

    def __update_code_diff_manager(self, myGitlab: GitLab) -> None:
        # update codeDiff ID for commits in master branch
        self.__update_code_diff_for_commit_list(
            self.__commitsManager.get_commit_list(), myGitlab
        )
        self.__update_code_diff_for_merge_request_and_commits(myGitlab)

    def __update_code_diff_for_commit_list(
        self, commitList: [Commit], myGitLab: GitLab
    ) -> None:
        for commit in commitList:
            codeDiff = myGitLab.get_commits_code_diff(commit.short_id)
            codeDiffID = self.__codeDiffManager.append_code_diff(codeDiff)
            commit.code_diff_id = codeDiffID

    def __update_code_diff_for_merge_request_and_commits(
        self, myGitlab: GitLab
    ) -> None:
        mr: MergeRequest
        for mr in self.__mergeRequestManager.merge_request_list:
            codeDiff = myGitlab.get_merge_request_code_diff_latest_version(mr.id)
            codeDiffID = self.__codeDiffManager.append_code_diff(codeDiff)
            mr.code_diff_id = codeDiffID
            self.__update_code_diff_for_commit_list(mr.related_commits_list, myGitlab)

    def get_commit_score_data(self, commit: Commit) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }

        codeDiff: list = self.__codeDiffManager.get_code_diff(commit.code_diff_id)
        for diff in codeDiff:
            codeDiffStats: dict = self.__codeDiffAnalyzer.get_code_diff_statistic(
                CodeDiff(diff)
            )

            for key1, key2 in zip(scoreData.keys(), codeDiffStats.keys()):
                assert key1 == key2
                scoreData[key1] += codeDiffStats[key2]

        return scoreData

    def get_merge_request_score_data(self, mergeRequest: MergeRequest) -> dict:
        scoreData = {
            "mergeRequestScoreData": {},
            "relatedCommitsScoreData": {
                "lines_added": 0,
                "lines_deleted": 0,
                "comments_added": 0,
                "comments_deleted": 0,
                "blanks_added": 0,
                "blanks_deleted": 0,
                "spacing_changes": 0,
                "syntax_changes": 0,
            },
        }

        codeDiff: list = self.__codeDiffAnalyzer.get_code_diff_by_id(
            mergeRequest.code_diff_id
        )
        for diff in codeDiff:
            mergeRequestScoreData = self.__codeDiffAnalyzer.get_code_diff_statistic(
                CodeDiff(diff)
            )
            scoreData["mergeRequestScoreData"] = deepcopy(mergeRequestScoreData)

        for commit in mergeRequest.related_commits_list:
            commitScoreData = self.get_commit_score_data(commit)

            for key1, key2 in zip(
                scoreData["mergeRequestScoreData"].keys(), commitScoreData.keys()
            ):
                assert key1 == key2
                scoreData["relatedCommitsScoreData"][key1] += commitScoreData[key2]

        return scoreData

    def get_file_type_score_data(self):
        # TODO
        pass

    def __analyze_master_commits_code_diff(self) -> None:
        for commit in self.commits_manager.get_commit_list():
            commit.line_counts = self.get_commit_score_data(commit)

    def __analyze_merge_requests_code_diff(self) -> None:
        mr: MergeRequest
        for mr in self.__mergeRequestManager.merge_request_list:
            mr.line_counts = self.get_merge_request_score_data(mr)[
                "mergeRequestScoreData"
            ]
            for commit in mr.related_commits_list:
                commit.line_counts = self.get_commit_score_data(commit)

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

    def __get_commit_list_and_authors(self, commits: [str]) -> (list, list):
        commitList = []
        authors = set()
        for commit in commits:
            commit = commit.to_dict()
            commitList.append(commit)
            authors.add(commit["author_name"])
        return commitList, list(authors)

    def __add_mr_to_associated_users(
        self, mergeRequestForAllUsers, authors, mr
    ) -> None:
        for author in authors:
            if author not in mergeRequestForAllUsers:
                mergeRequestForAllUsers[author] = []
            mergeRequestForAllUsers[author].append(mr)

    def get_merge_request_and_commit_list_for_users(self) -> dict:
        mergeRequestForAllUsers = {}

        for mr in self.__mergeRequestManager.merge_request_list:
            singleMR = mr.to_dict()
            commitList, authors = self.__get_commit_list_and_authors(
                singleMR["related_commits_list"]
            )
            singleMR["commit_list"] = commitList
            # delete related_commits_list so jsonify won't throw error
            del singleMR["related_commits_list"]
            self.__add_mr_to_associated_users(
                mergeRequestForAllUsers, authors, singleMR
            )
        return mergeRequestForAllUsers

    def get_all_merge_request_and_commit(self) -> list:
        mergeRequests = []

        for mr in self.__mergeRequestManager.merge_request_list:
            singleMR = mr.to_dict()
            singleMR["commit_list"] = []
            for commits in singleMR['related_commits_list']:
                singleMR["commit_list"].append(commits.to_dict())
            del singleMR['related_commits_list']
            mergeRequests.append(singleMR)
        return mergeRequests

    def get_code_diff(self, codeDiffID: int) -> [dict]:
        return self.__codeDiffManager.get_code_diff(codeDiffID)

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
