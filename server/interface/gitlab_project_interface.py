from model.commit import Commit
from typing import Optional, List
from interface.gitlab_interface import GitLab
from manager.comment_manager import CommentManager
from manager.commit_manager import CommitManager
from manager.member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager
from manager.issue_manager import IssueManager
from model.project import Project
from model.code_diff import CodeDiff
from model.merge_request import MergeRequest
from model.commit import Commit
from copy import deepcopy


class GitLabProject:
    def __init__(self, myGitlab: GitLab, projectID: int):
        myGitlab.set_project(projectID=projectID)
        self.__gitlab = myGitlab  # TODO: This need to be deleted after
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
        mergeRequests, _ = myGitlab.get_merge_requests_and_commits(state="all")
        for mergeRequest in mergeRequests:
            self.__mergeRequestManager.add_merge_request(mergeRequest)

    def __update_member_manager(self, myGitlab: GitLab) -> None:
        members: list = myGitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)
        pass

    def __update_commits_manager(self, myGitlab: GitLab) -> None:
        commitList: list = myGitlab.get_commit_list_for_project()
        tempUserSet: set = set()
        for commit in commitList:
            # Get all git users, set will only store unique values
            tempUserSet.add(commit.author_name)
            self.__commitsManager.add_commit(commit)
        self.__user_list = list(tempUserSet)

    def __update_issues_manager(self, myGitlab: GitLab) -> None:
        issueList: list = myGitlab.get_issue_list()
        self.__issuesManager.populate_issue_list(issueList)

    def get_commits_in_merge_request(self, merge_request_id: int) -> List[Commit]:
        # returns list of commits in the merge request
        # Maybe not needed
        pass

    def get_commit_score_data(self, commit: Commit) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0
        }

        if commit is not None:
            scoreData = deepcopy(commit.score_body)
        
        return scoreData

    def get_merge_request_score_data(self, mergeRequest: MergeRequest) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0
        }

        commits = mergeRequest.related_commits
        for commit in commits:
            commitScoreData = self.get_commit_score_data(commit.id)

            for key1, key2 in zip(scoreData.keys(), commitScoreData.keys()):
                assert key1 == key2
                scoreData[key1] += commitScoreData[key2]
        
        return scoreData

    # might not be needed?
    def get_all_merge_request_score_data(self) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0
        }

        for mr in self.__mergeRequestManager.merge_request_list:
            mergeRequestScoreData = self.get_merge_request_score_data(mr.id)

            for key1, key2 in zip(scoreData.keys(), mergeRequestScoreData.keys()):
                assert key1 == key2
                scoreData[key1] += scoreData[key2]
        
        return scoreData

    # might not be needed?
    def get_user_score_data(self, user_name: str) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0
        }

    def get_file_type_score_data(self):
        # TODO
        pass

    # Getters
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

    # deprecated
    def get_merge_request_and_commit_list(self) -> list:
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
