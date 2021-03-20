from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List


class GitLabAnalyzer:
    def __init__(self):
        self.__user_list: List[str] = []

        # list of repositories that user has access
        self.__project_list: List[GitLabProject] = []

        # hashed tokens
        self.__user_token_list: List[str] = []
        self.__current_user_token: str = None

        self.__url: str = None  # not sure if needed

        self.__analyzing_repository: GitLabProject = None
        self.__analyzing_user: str = None  # username

    def add_project(self, project: GitLabProject):
        self.__project_list.append(project)

    def add_user(self, user):
        self.__user_list.append(user)

    def add_token(self, token):
        self.__user_token_list.append(token)

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

    @property
    def current_user_token(self):
        return self.__current_user_token
