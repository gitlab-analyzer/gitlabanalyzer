import threading
from typing import Union, Tuple

import gitlab

from interface.gitlab_analyzer_interface import GitLabAnalyzer

ERROR_CODES = {
    "invalidToken": "Invalid token",
    "invalidProjectID": "Invalid project ID"
}


class GitLabAnalyzerManager:
    def __init__(self):
        self.__gitlab_list: dict = {}

    # authenticate and add the gitlab instance on success
    def add_gitlab(self, token: str, hashedToken: str, url: str) -> Tuple[bool, str]:
        try:
            myGitLabAnalyzer = GitLabAnalyzer(token, hashedToken, url)
            self.__gitlab_list[hashedToken] = myGitLabAnalyzer
            return True, ""
        except gitlab.exceptions.GitlabAuthenticationError:
            return False, ERROR_CODES["invalidToken"]

    def __find_gitlab(self, hashedToken: str) -> Union[GitLabAnalyzer]:
        return self.__gitlab_list.get(hashedToken, None)

    def get_project_list(self, hashedToken: str) -> Tuple[bool, str, list]:
        myGitLab = self.__find_gitlab(hashedToken)
        if myGitLab is not None:
            return True, "", myGitLab.get_all_gitlab_project_name()
        else:
            return False, ERROR_CODES["invalidToken"], []

    def __sync_project_helper(self, projectID: int, myAnalyzer: GitLabAnalyzer) -> None:
        myAnalyzer.update_project(projectID)

    def __check_if_valid_token(self, hashedToken: str, projectID: int) -> Tuple[bool, str, Union[GitLabAnalyzer, None]]:
        myGitLab = self.__find_gitlab(hashedToken)
        if myGitLab is None:
            return False, ERROR_CODES["invalidToken"], myGitLab
        if myGitLab.get_gitlab_project_by_id(projectID) is None:
            return False, ERROR_CODES["invalidProjectID"], myGitLab
        return True, "", myGitLab

    def sync_project(self, hashedToken: str, projectID: int) -> Tuple[bool, str]:
        isValid, errorCode, myGitLab = self.__check_if_valid_token(hashedToken, projectID)
        if isValid:
            threading.Thread(target=self.__sync_project_helper, args=(projectID, myGitLab)).start()
        return isValid, errorCode

    def check_sync_state(self, hashedToken: str, projectID: int) -> Tuple[bool, str, dict]:
        isValid, errorCode, myGitLab = self.__check_if_valid_token(hashedToken, projectID)
        syncState = {}
        if isValid:
            syncState = myGitLab.get_gitlab_project_by_id(projectID).get_project_sync_state()
        return isValid, errorCode, syncState

    def get_project_members(self, hashedToken: str, projectID: int) -> Union[dict, None]:
        # TODO: need to discuss with frontend
        pass

    # TODO: Resume from here
