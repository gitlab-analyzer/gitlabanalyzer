import gitlab

class GitLab:
    def __init__(self, token, url=None):
        self.token = token
        self.project_lists = None
        if url is None:
            self.url = "https://csil-git1.cs.surrey.sfu.ca/"
        else:
            self.url = url
        self.gl = gitlab.Gitlab(self.url, self.token)

    def authenticate(self):
        try:
            self.gl.auth()
        except:
            return False
        return True

    def get_project_list(self):
        if not self.project_lists:
            self.project_lists = self.gl.projects.list(visibility='private')
        return self.project_lists

    def get_commit_list_for_project(self, projectID):
        myProjects = self.get_project_list()
        for project in myProjects:
            if project.id == projectID:
                return project.commits.list()
        return None

    # Example: since='2016-01-01T00:00:00Z'
    def get_commit_list_for_project_with_range(self, projectID, sinceDate, untilDate):
        myProjects = self.get_project_list()
        for project in myProjects:
            if project.id == projectID:
                return project.commits.list(since=sinceDate, until=untilDate)
        return None

    # Return a list of commit diff for a project
    def get_commit_diff_list(self, projectID, sinceDate=None, untilDate=None):
        commitDiff = []
        if not (sinceDate and untilDate):
            commitList = self.get_commit_list_for_project(projectID)
        else:
            commitList = self.get_commit_list_for_project_with_range(projectID, sinceDate, untilDate)

        for oneCommit in commitList:
            commitDiff.append(oneCommit.diff())
        return commitDiff

    # First return value: a list of merge requests
    # Ex: [mergeRequest1, mergeRequest2]
    # Second return value: a list of all commits for each merge requests
    # Ex: [[commit1, commit2], [commit1]]
    def get_merge_requests_and_commits(self, projectID, state=None, order_by=None, sort=None):
        commitsForMergeRequests = []
        myProjects = self.get_project_list()
        for project in myProjects:
            if project.id == projectID:
                mergeRequests = project.mergerequests.list(state=state, order_by=order_by, sort=sort)

                for mergeRequest in mergeRequests:
                    myCommits = mergeRequest.commits()
                    commitsList = []
                    for _ in range(myCommits.total_pages):
                        commitsList.append(myCommits.next())
                    commitsForMergeRequests.append(commitsList)
                return mergeRequests, commitsForMergeRequests
        return None
