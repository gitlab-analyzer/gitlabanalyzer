import datetime
from copy import deepcopy

import gitlab

from interface.gitlab_project_interface import GitLabProject
from interface.gitlab_interface import GitLab
from typing import List, Optional


class GitLabAnalyzer:
    def __init__(self, user_token: str, user_token_hashed=None, url=None):
        self.__project_list: List[GitLabProject] = []
        self.__configs: dict = {}
        self.__gitlab: GitLab = GitLab(user_token, url)
        self.__user_token_hashed: str = user_token_hashed  # hashed
        self.__last_time_access: datetime = datetime.datetime.now()
        if self.__gitlab.authenticate():
            self.__username: str = self.__gitlab.get_username()  # related to user_token
            self.__update_project_list()
        else:
            raise gitlab.exceptions.GitlabAuthenticationError

    def add_project(self, project: GitLabProject) -> None:
        self.__project_list.append(project)

    def __update_project_list(self) -> None:
        projectList = self.__gitlab.get_project_list()

        for project in projectList:
            gitlabProjectInterface = GitLabProject(project, project.default_branch)
            self.__project_list.append(gitlabProjectInterface)

    def get_gitlab_project_by_id(self, projectID: int) -> Optional[GitLabProject]:
        for project in self.__project_list:
            if project.project_id == projectID:
                return project
        return None

    def get_all_gitlab_project_name_and_id(self) -> list:
        myList: list = []
        for project in self.__project_list:
            projectInfo = {"name": project.project_name, "id": project.project_id}
            myList.append(projectInfo)
        return myList

    def update_project(self, projectID):
        myProject = self.get_gitlab_project_by_id(projectID)
        tempGitLab = deepcopy(self.__gitlab)
        tempGitLab.set_project(projectID)
        myProject.update(tempGitLab)

    @property
    def user_token(self):
        return self.__user_token_hashed

    @property
    def username(self):
        return self.__username

    @property
    def last_time_access(self):
        return self.__last_time_access

    @property
    def configs(self):
        return self.__configs

    @last_time_access.setter
    def last_time_access(self, myTime: datetime) -> None:
        self.__user_token_hashed = myTime

    @user_token.setter
    def user_token(self, hashed_token: str) -> None:
        self.__user_token_hashed = hashed_token

    @username.setter
    def username(self, user_name: str) -> None:
        self.__username = user_name
