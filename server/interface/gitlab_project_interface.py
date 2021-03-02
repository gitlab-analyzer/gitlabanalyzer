from gitlab_interface import GitLab
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

        """
        self.__update_comment_manager()
        self.__update_merge_request_manager()
        self.__update_member_manager()
        self.__update_commits_manager()
        """
        #self.__update_issues_manager() # TODO fix Issue

    def update_comment_manager(self):
        #Get comments on MR
        mrList = self.__gitlab.get_merge_requests_and_commits(state='all')[0] #get only the MRs
        for mr in mrList:
            mergeRequest = self.__gitlab.get_specific_mr(mr.iid)
            #mr_notes = mergeRequest.notes.list()
            mr_notes = self.__gitlab.get_comments_of_mr(mergeRequest)

            for item in mr_notes:
                print(item.body)
                self.__commentsManager.add_comment(item)

        print ("\n")

        #Get comments on Issue
        issueList = self.__gitlab.get_issue_list()
        for issue in issueList:
            anIssue = self.__gitlab.get_specific_issue(issue.iid)
            #issue_notes = anIssue.notes.list()
            issue_notes = self.__gitlab.get_comments_of_issue(anIssue)

            for item in issue_notes:
                print(item.body)
                self.__commentsManager.add_comment(item)

        print ("\n")

        #Get comments on Code Commits
        allCommits = self.__gitlab.get_commit_list_for_project()     #get list of all commits
        for commit in allCommits:
            aCommit = self.__gitlab.get_specific_commit(commit.short_id)     
            #commit_notes = aCommit.comments.list()      
            commit_notes = self.__gitlab.get_comments_of_commit(aCommit) #get list of all comments of a commit 

            for item in commit_notes:
                print(item.note)
                self.__commentsManager.add_comment(item, commit.short_id)

    def update_merge_request_manager(self):
        mergeRequests, commitsForMR = self.__gitlab.get_merge_requests_and_commits(state='all')

        """
        for commit in commitsForMR:
            print(commit)
        for mergeRequest in mergeRequests:
            print(mergeRequest.iid)
        
        
        for mergeRequest in mergeRequests:
            self.__mergeRequestManager.add_merge_request(mergeRequest, commitsForMR[i])
    
        """

        for i in range (0, len(mergeRequests)):
            self.__mergeRequestManager.add_merge_request(mergeRequests[i], commitsForMR[i])

        """
        commits_of_mr = []

        mergeRequests = self.__gitlab.get_merge_requests(state='all')
        for mr in mergeRequests:
            #print(mr.iid)
            commits = self.__gitlab.get_commits_of_merge_requests(mr)
            for commit in commits:      #get related commits
                #print(commit.short_id)
                commits_of_mr.append(commit.short_id)
            self.__mergeRequestManager.add_merge_request(mr, commits_of_mr)

        """


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

    def get_comment_list(self): 
        return self.__commentsManager.get_comment_list()

    def get_merge_request_list(self):
        return self.__mergeRequestManager.merge_request_list



# gl = GitLab(token='Cy2V5TYVWRwmwf9trh-X', url='https://csil-git1.cs.surrey.sfu.ca/')
# gl.authenticate()
# gl.get_project_list()
# gl.set_project(25515)
# list = gl.get_commit_list_for_project()

print("START TESTING\n")

gl = GitLab(token='c-Z7RjtQ1qtt2vWVYbjx', url='https://csil-git1.cs.surrey.sfu.ca/')
gl.authenticate()
gl.get_project_list()
#gl.set_project(26637)
"""
list = gl.get_commit_list_for_project()

for item in list:
    print(item)
"""

test = GitLabProject(gl, 26637)
test.update_comment_manager()


print("\n")
for item in test.get_comment_list():
    print(item.to_json())
print("Length total: ", len(test.get_comment_list()))


print("\n")
test.update_merge_request_manager()
for item in test.get_merge_request_list():
    print(item.to_json())
print("Length total: ", len(test.get_merge_request_list()))



