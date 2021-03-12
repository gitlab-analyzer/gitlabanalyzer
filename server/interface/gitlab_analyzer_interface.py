from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List


# interface for our whole GitLab Analyzer Application
# has gitlab_project_interface objects, use gitlab_interface
class GitLabAnalyzer:
    def __init__(self):
        self.__user_list: List[str] = []	# list of users (including members + non members) we want to analyze
        self.__project_list: List[GitLabProject] = []   # list of gitlab_project_interface (list of repositories)
        
        # not sure if needed
        self.__analyzing_user = None    # the user that we are currently analyzing

    def add_project(self, project: GitLabProject):
        self.__project_list.append(project)

    def add_user(self, user):   
    	self.__user_list.append(user)

    def update_users(self):
    	# update 
        pass

    def update_project_list(self, gitlab: GitLab):
        projectList = gitlab.get_project_list()

        for project in projectList:
            gitlabProjectInterface = GitLabProject(gitlab, project.id)
            self.__project_list.append(gitlabProjectInterface)

    def match_user_with_member(self, user, member):    # this parameter should change (temporary)
        pass

    def check_if_user_has_multiple_accounts(self):
        pass

    def get_only_non_members(self):
        pass


    @property
    def user_list(self):
    	return self.__user_list
    
    @property
    def project_list(self):
    	return self.__project_list
    


gl = GitLab(token="c-Z7RjtQ1qtt2vWVYbjx", url="https://csil-git1.cs.surrey.sfu.ca/")
gl.authenticate()


print("\nSTART")
# test = GitLabProject(gl, 25515)

analyzer = GitLabAnalyzer()
listt = analyzer.update_project_list(gl)

for item in analyzer.project_list:
    print(item.project_id)



