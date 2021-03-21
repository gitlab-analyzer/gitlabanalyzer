from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List, Optional


class GitLabAnalyzer:
    def __init__(self, user_token=None, username=None):
        self.__project_list: List[GitLabProject] = []
        self.__user_token: str = user_token  # hashed
        self.__username: str = username  # related to user_token

    def add_project(self, project: GitLabProject) -> None:
        self.__project_list.append(project)

    def update_project_list(self, gitlab: GitLab) -> None:
        projectList = gitlab.get_project_list()

        for project in projectList:
            gitlabProjectInterface = GitLabProject(gitlab, project.id)
            self.__project_list.append(gitlabProjectInterface)

    def get_gitlab_project_by_id(self, projectID: int) -> Optional[GitLabProject]:
        for project in self.__project_list:
            if project.project_id == projectID:
                return project
        return None

    @property
    def user_token(self):
        return self.__user_token

    @property
    def username(self):
        return self.__username

    @user_token.setter
    def user_token(self, hashed_token: str) -> None:
        self.__user_token = hashed_token

    @username.setter
    def username(self, user_name: str) -> None:
        self.__username = user_name
