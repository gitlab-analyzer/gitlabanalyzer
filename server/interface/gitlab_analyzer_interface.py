from interface.gitlab_project_interface import GitLabProject


class GitLabAnalyzer:
    def __init__(self):
        self.__user_list: list = None
        self.__repo_list: list = None  # list of gitlab project interface

    def add_repository(self, repository: GitLabProject):
        self.__repo_list.append(repository)
