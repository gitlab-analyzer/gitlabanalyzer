from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List


class GitLabAnalyzer:
    def __init__(self):
        self.__user_list: List[str] = []	# list of users
        self.__project_list: List[GitLabProject] = []   # list of repositories (Gitlab Project Interface)
        self.__current_user_token = None    # hashed

        # temporary variables
        self.__analyzing_repository = None  
        self.__analyzing_user = None   

    def add_project(self, project: GitLabProject):
        self.__project_list.append(project)

    def add_user(self, user):   
    	self.__user_list.append(user)

    def update_users(self):
        pass

    def update_project_list(self, gitlab: GitLab):
        projectList = gitlab.get_project_list()

        for project in projectList:
            gitlabProjectInterface = GitLabProject(gitlab, project.id)
            self.__project_list.append(gitlabProjectInterface)

    def set_current_user_token(self, hashed_str):
        self.__current_user_token = hashed_str

    @property
    def user_list(self):
    	return self.__user_list
    
    @property
    def project_list(self):
    	return self.__project_list
