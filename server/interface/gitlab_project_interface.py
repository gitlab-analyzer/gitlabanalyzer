import datetime
import threading
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

from typing import List, Tuple

TOTAL_SYNC_STAGES: int = 7


class GitLabProject:
    def __init__(self, projectID: int, projectName: str = ""):
        self.__membersManager: MemberManager = MemberManager()
        self.__issuesManager: IssueManager = IssueManager()
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()
        self.__codeDiffManager: CodeDiffManager = CodeDiffManager()
        self.__codeDiffAnalyzer: CodeDiffAnalyzer = CodeDiffAnalyzer()
        self.__projectID: int = projectID
        self.__projectName: str = projectName
        self.__is_syncing: bool = False
        self.__last_synced: datetime = None
        self.__syncing_state: str = "Not Synced"
        self.__syncing_progress: int = 0
        # This will be filled after the call to self.__update_commits_manager(myGitlab)
        self.__user_list: list = []

    def get_project_sync_state(self) -> dict:
        return {
            "projectID": self.__projectID,
            "is_syncing": self.__is_syncing,
            "last_synced": self.__last_synced,
            "syncing_state": self.__syncing_state,
            "syncing_progress": int(self.__syncing_progress / TOTAL_SYNC_STAGES * 100),
        }

    def update(self, myGitlab: GitLab) -> None:
        self.__syncing_progress = 0
        self.__is_syncing = True
        myGitlab.set_project(projectID=self.__projectID)
        # construct a thread list that each thread responsible to update a different manager
        myThreadList: list = [
            threading.Thread(
                target=self.__update_merge_request_manager, args=(myGitlab,)
            ),
            threading.Thread(target=self.__update_member_manager, args=(myGitlab,)),
            threading.Thread(target=self.__update_commits_manager, args=(myGitlab,)),
            threading.Thread(target=self.__update_issues_manager, args=(myGitlab,)),
        ]
        self.__syncing_state = "Syncing data from remote..."
        self.__start_and_join_all_thread(myThreadList)
        self.__update_code_diff_manager(myGitlab)
        myThreadList: list = [
            threading.Thread(target=self.__analyze_master_commits_code_diff, args=()),
            threading.Thread(target=self.__analyze_merge_requests_code_diff, args=()),
        ]
        self.__syncing_state = "Analyzing..."
        self.__start_and_join_all_thread(myThreadList)
        self.__syncing_state = "Synced"
        self.__last_synced = datetime.datetime.now()
        self.__is_syncing = False

    def __start_and_join_all_thread(self, myThreadList: list) -> None:
        # start all threads
        for jobs in myThreadList:
            jobs.start()
        # wait until all of them to finish
        for jobs in myThreadList:
            jobs.join()

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
        self.__syncing_progress = self.__syncing_progress + 1

    def __update_member_manager(self, myGitlab: GitLab) -> None:
        members: list = myGitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)
        self.__syncing_progress = self.__syncing_progress + 1

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
        self.__syncing_progress = self.__syncing_progress + 1

    def __update_issues_manager(self, myGitlab: GitLab) -> None:
        issueList: list = myGitlab.get_issue_list()
        self.__issuesManager.populate_issue_list(issueList)
        # Get comments
        for issue in issueList:
            issue_notes = myGitlab.get_comments_of_issue(issue.iid)
            for item in issue_notes:
                if item.system is False:
                    self.__commentsManager.add_comment(item)
        self.__syncing_progress = self.__syncing_progress + 1

    def __update_code_diff_manager(self, myGitlab: GitLab) -> None:
        # update codeDiff ID for commits in master branch
        self.__update_code_diff_for_commit_list(
            self.__commitsManager.get_commit_list(), myGitlab
        )
        self.__update_code_diff_for_merge_request_and_commits(myGitlab)
        self.__syncing_progress = self.__syncing_progress + 1

    def __update_code_diff_for_commit_list(
        self, commitList: List[Commit], myGitLab: GitLab
    ) -> None:
        for commit in commitList:
            codeDiff: List[dict] = myGitLab.get_commits_code_diff(commit.short_id)
            self.__update_code_diff(codeDiff)
            codeDiffID = self.__codeDiffManager.append_code_diff(codeDiff)
            commit.code_diff_id = codeDiffID

    def __update_code_diff_for_merge_request_and_commits(
        self, myGitlab: GitLab
    ) -> None:
        mr: MergeRequest
        for mr in self.__mergeRequestManager.merge_request_list:
            codeDiff = myGitlab.get_merge_request_code_diff_latest_version(mr.id)
            self.__update_code_diff(codeDiff)
            codeDiffID = self.__codeDiffManager.append_code_diff(codeDiff)
            mr.code_diff_id = codeDiffID
            self.__update_code_diff_for_commit_list(mr.related_commits_list, myGitlab)

    def __update_code_diff(self, codeDiffList: List[dict]) -> None:
        for diff in codeDiffList:
            diffStats: dict = self.__codeDiffAnalyzer.get_code_diff_statistic(
                CodeDiff(diff)
            )
            diff.update(diffStats)

    def get_commit_score_data(self, commit: Commit) -> dict:
        # TODO: CHANGE
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

        codeDiff: List[dict] = self.__codeDiffManager.get_code_diff(commit.code_diff_id)
        for diff in codeDiff:
            for key in scoreData.keys():
                scoreData[key] += diff[key]

        return scoreData

    def get_merge_request_score_data(self, mergeRequest: MergeRequest) -> dict:
        # TODO: CHANGE
        scoreData = {
            "mergeRequestScoreData": {
                "lines_added": 0,
                "lines_deleted": 0,
                "comments_added": 0,
                "comments_deleted": 0,
                "blanks_added": 0,
                "blanks_deleted": 0,
                "spacing_changes": 0,
                "syntax_changes": 0,
            },
            "relatedCommitsScoreData": {},
        }

        codeDiff: List[dict] = self.__codeDiffManager.get_code_diff(
            mergeRequest.code_diff_id
        )
        for diff in codeDiff:
            for key in scoreData["mergeRequestScoreData"].keys():
                scoreData["mergeRequestScoreData"][key] += diff[key]

        for commit in mergeRequest.related_commits_list:
            commitScoreData = self.get_commit_score_data(commit)
            for key in commitScoreData.keys():
                scoreData["relatedCommitsScoreData"][key] += commitScoreData[key]

        return scoreData

    def __analyze_master_commits_code_diff(self) -> None:
        self.__syncing_state = "Analyzing commits"
        for commit in self.commits_manager.get_commit_list():
            commit.line_counts = self.get_commit_score_data(commit)
        self.__syncing_progress = self.__syncing_progress + 1

    def __analyze_merge_requests_code_diff(self) -> None:
        self.__syncing_state = "Analyzing merge requests"
        mr: MergeRequest
        for mr in self.__mergeRequestManager.merge_request_list:
            mr.line_counts = self.get_merge_request_score_data(mr)[
                "mergeRequestScoreData"
            ]
            for commit in mr.related_commits_list:
                commit.line_counts = self.get_commit_score_data(commit)
        self.__syncing_progress = self.__syncing_progress + 1

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

    def get_commit_list_on_master(self) -> list:
        return self.__commitsManager.get_commit_list_json()

    def get_commits_for_all_users(self) -> list:
        commitListsForAllUsers: list = self.__initialize_member_and_user_list()

        for commit in self.__commitsManager.get_commit_list():
            for user in commitListsForAllUsers:
                if user["user_name"] == commit.author_name:
                    user["commits"].append(commit.to_dict())
                    break
        return commitListsForAllUsers

    def __get_commit_list_and_authors(self, commits: List[str]) -> Tuple[list]:
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
            for commits in singleMR["related_commits_list"]:
                singleMR["commit_list"].append(commits.to_dict())
            del singleMR["related_commits_list"]
            mergeRequests.append(singleMR)
        return mergeRequests

    def get_code_diff(self, codeDiffID: int) -> List[dict]:
        return self.__codeDiffManager.get_code_diff(codeDiffID)

    def get_all_comments(self) -> List[dict]:
        commentList = []
        for comment in self.__commentsManager.get_comment_list():
            commentList.append(comment.to_dict())
        return commentList

    def get_comments_for_all_users(self) -> dict:
        commentList = {}
        for comment in self.__commentsManager.get_comment_list():
            if commentList.get(comment.author, None) is None:
                commentList[comment.author] = []
            commentList[comment.author].append(comment.to_dict())
        return commentList

    def get_members(self) -> list:
        memberInfoList: list = []
        memberList = self.__membersManager.get_member_list()
        for member in memberList:
            memberInfoList.append(member.to_dict())
        return memberInfoList

    @property
    def project_id(self) -> int:
        return self.__projectID

    @property
    def project_name(self) -> str:
        return self.__projectName

    @property
    def user_list(self) -> list:
        return self.__user_list

    # TODO: Need to be removed in the future
    @property
    def merge_request_manager(self) -> MergeRequestManager:
        return self.__mergeRequestManager

    # TODO: Need to be removed in the future
    @property
    def commits_manager(self) -> CommitManager:
        return self.__commitsManager

    # TODO: Need to be removed in the future
    @property
    def member_manager(self) -> MemberManager:
        return self.__membersManager


# ----------------------------------------------------------------------------------

    # update merge request manager after mapping
    def map_users_to_member_version2(self, member, userList):
        self.update_merge_request_manager_after_mapping(member,userList)
        self.update_commits_manager_after_mapping(member, userList)

    def update_commits_manager_after_mapping(self, member, userList):
        all_commits_list = self.commits_manager.get_commit_list()
        for commit in all_commits_list:
            if commit.author_name in userList:
                commit.author_name = member     # temp: "Changed"

    def update_merge_request_manager_after_mapping(self, member, userList):
        all_mrs_list = self.merge_request_manager.merge_request_list
        for mr in all_mrs_list:
            commits_list = mr.related_commits_list
            for commit in commits_list:
                if commit.author_name in userList:
                    commit.author_name = member     # temp: "Changed"
                """
                for mapping_user in userList:
                    if commit.author_name == mapping_user:
                        commit.author_name = "c_hanged!"
                """

    # ----------------------------------------------------------------------------------

    # memberList: [memberA, memberB]
    # userList: [[userA_1, userA_2], [userB_1]]
    def map_users_multiple_members(self, memberList, userList):
        self.update_merge_request_manager_version2(memberList, userList)
        self.update_commits_manager_version2(memberList, userList)

    def update_merge_request_manager_version2(self, memberList, userList):
        all_mrs_list = self.merge_request_manager.merge_request_list
        for mr in all_mrs_list:
            commits_list = mr.related_commits_list
            for i in range (0, len(commits_list)):
                commit_authorName = commits_list[i].author_name
                for user_sublist in range (0, len(userList)):
                    if commit_authorName in userList[user_sublist]:
                        # index = userList[j].index(commit_authorName)
                        mr.related_commits_list[i].author_name = memberList[user_sublist]
                    """
                    index = userList.index(commit_authorName)
                    mr.related_commits_list[i].author_name = memberList[index]  # replace author name
                    """

    def update_commits_manager_version2(self, memberList, userList):
        """
        all_commits_list = self.commits_manager.get_commit_list()
        for i in range (0, len(all_commits_list)):
            commit_authorName = all_commits_list[i].author_name
            if commit_authorName in userList:
                index = userList.index(commit_authorName)
                all_commits_list[i].author_name = memberList[index]
        """
        all_commits_list = self.commits_manager.get_commit_list()
        for i in range (0, len(all_commits_list)):
            commit_authorName = all_commits_list[i].author_name
            for user_sublist in range (0, len(userList)):
                if commit_authorName in userList[user_sublist]:
                    all_commits_list[i].author_name = memberList[user_sublist]
        