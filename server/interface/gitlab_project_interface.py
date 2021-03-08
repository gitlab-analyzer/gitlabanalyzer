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

class GitLabProject:
    def __init__(self, myGitlab: GitLab, projectID: int):
        self.__gitlab: GitLab = myGitlab

        # should this be necessary? -Josh
        self.__gitlab.set_project(projectID=projectID)

        self.__project: Optional[Project] = None
        for project in self.__gitlab.get_project_list():
            if project.id == projectID:
                self.__project = Project(project)

        self.__membersManager: MemberManager = MemberManager()
        self.__issuesManager: IssueManager = IssueManager()
        self.__commitsManager: CommitManager = CommitManager()
        self.__commentsManager: CommentManager = CommentManager()
        self.__mergeRequestManager: MergeRequestManager = MergeRequestManager()

        self.__update_comment_manager()
        self.__update_merge_request_manager()
        self.__update_member_manager()
        self.__update_commits_manager()
        self.__update_issues_manager()

    def __update_comment_manager(self) -> None:
        # TODO: This needs to be discussed
        # https://python-gitlab.readthedocs.io/en/stable/gl_objects/notes.html
        pass

    def __update_merge_request_manager(self) -> None:
        mergeRequests, _ = self.__gitlab.get_merge_requests_and_commits(state="all")
        for mergeRequest in mergeRequests:
            self.__mergeRequestManager.add_merge_request(mergeRequest)

    def __update_member_manager(self) -> None:
        members: list = self.__gitlab.get_all_members()
        for member in members:
            self.__membersManager.add_member(member)
        pass

    def __update_commits_manager(self) -> None:
        commitList: list = self.__gitlab.get_commit_list_for_project()
        for commit in commitList:
            self.__commitsManager.add_commit(commit)

    def __update_issues_manager(self) -> None:
        issueList: list = self.__gitlab.get_issue_list()
        self.__issuesManager.populate_issue_list(issueList)

    def get_commits_in_merge_request(self, merge_request_id: int) -> List[Commit]:
        # returns list of commits in the merge request
        pass

    def get_commit_score_data(self, commit_id: int) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0
        }

        commit = self.__commitsManager.get_commit_by_id(commit_id)
        if commit is not None:

            # TODO: CodeDiffManager & get_code_diff_by_commit_id method & sha attribute in commit
            codeDiffs: List[CodeDiff] = [] # GET CODE DIFFS FOR COMMIT METHOD HERE

            for diff in codeDiffs:
                scoreData["lines_added"] += diff.lines_added()
                scoreData["lines_deleted"] += diff.lines_deleted()
                scoreData["blanks_added"] += diff.blanks_added()
                scoreData["blanks_deleted"] += diff.blanks_deleted()
                scoreData["spacing_changes"] += diff.spacing_change()
                scoreData["syntax_changes"] += diff.syntax_change()
        
        return scoreData

    def get_merge_request_score_data(self, merge_request_id: int) -> dict:
        scoreData = {
            "lines_added": 0,
            "lines_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0
        }

        commits = self.get_commits_in_merge_request(merge_request_id)
        if len(commits) > 0:

            for commit in commits:
                commitScoreData = self.get_commit_score_data(commit.id)

                for key1, key2 in zip(scoreData.keys(), commitScoreData.keys()):
                    assert key1 == key2
                    scoreData[key1] += commitScoreData[key2]
        
        return scoreData

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

    # If only knowing the name of the member, then you must convert the name to id using
    # the mapping (name -> id) done by the front-end or something.
    def get_member_score_data(self, member_id: int) -> dict:
        pass

    def get_file_type_score_data(self) -> dict:
        pass

    # Getters

    @property
    def project_id(self) -> Project:
        return self.__project

    # Should this be here? -Josh
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
