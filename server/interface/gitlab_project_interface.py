import gitlab
from gitlab_interface import GitLab
from manager.comment_manager import CommentManager
from manager.commit_manager import CommitManager
from manager.member_manager import MemberManager
from manager.merge_request_manager import MergeRequestManager



class GitLabProject:
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

    def update_comment_manager(self):
        #Get comments on MR
        mrList = self.__gitlab.get_merge_requests_and_commits(state='all')[0] #get only the MRs
        for mr in mrList:
            mergeRequest = self.__gitlab.get_specific_mr(mr.iid)
            mr_notes = mergeRequest.notes.list()

            for item in mr_notes:
                print(item.body)
                self.__commentsManager.add_comment(item)

        print ("\n")

        #Get comments on Issue
        issueList = self.__gitlab.get_issue_list()
        for issue in issueList:
            anIssue = self.__gitlab.get_specific_issue(issue.iid)
            issue_notes = anIssue.notes.list()

            for item in issue_notes:
                print(item.body)
                self.__commentsManager.add_comment(item)

        print ("\n")

        #Get comments on Code Commits
        allCommits = self.__gitlab.get_commit_list_for_project()     #get list of all commits
        for commit in allCommits:
            aCommit = self.__gitlab.get_specific_commit(commit.short_id)     
            commit_notes = aCommit.comments.list()      #get list of all comments of a commit 

            for item in commit_notes:
                print(item.note)
                self.__commentsManager.add_comment(item, commit.short_id)


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

    def get_comment_list(self): 
        return self.__commentsManager.get_comment_list()



print("START TESTING\n")

gl = GitLab(token='c-Z7RjtQ1qtt2vWVYbjx', url='https://csil-git1.cs.surrey.sfu.ca/')
gl.authenticate()
gl.get_project_list()
gl.set_project(26637)
"""
list = gl.get_commit_list_for_project()

for item in list:
    print(item)
"""

test = GitLabProject(gl)
test.update_comment_manager()


print("\n")
for item in test.get_comment_list():
    print(item.to_json())
print("Length total: ", len(test.get_comment_list()))
