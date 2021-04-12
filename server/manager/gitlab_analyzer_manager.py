import datetime
import threading
import time
from typing import Union, Tuple

import gitlab
from interface.gitlab_analyzer_interface import GitLabAnalyzer
from interface.gitlab_project_interface import GitLabProject

ERROR_CODES = {
    "invalidToken": "Invalid token",
    "invalidProjectID": "Invalid project ID",
    "projectIsSyncing": "Project is syncing",
    "partialInvalidProjectID": "Some project IDs are invalid, or they are already syncing",
}


class GitLabAnalyzerManager:
    def __init__(
        self,
        maximum_exist_time=datetime.timedelta(hours=6),
        worker_check_period_hours: int = 6,
    ):
        self.__gitlab_list: dict = {}
        self.__gitlab_list_lock = threading.Lock()
        self.__worker_should_run_signal: bool = False
        self.__garbage_monitor = threading.Thread(
            target=self.__garbage_monitor_worker, args=(self.__gitlab_list_lock,)
        )
        self.__maximum_exist_time: datetime = maximum_exist_time
        self.__worker_check_period = self.__hour_to_seconds(worker_check_period_hours)

    def __hour_to_seconds(self, hours: int) -> int:
        return hours * 60 * 60

    def __update_last_access_time(self, hashedToken: str) -> None:
        myGitLabAnalyzer: GitLabAnalyzer = self.__gitlab_list.get(hashedToken, None)
        if myGitLabAnalyzer is not None:
            myGitLabAnalyzer.last_time_access = datetime.datetime.now()

    # authenticate and add the gitlab instance on success. If success, it will also return username
    def add_gitlab(
        self, token: str, hashedToken: str, url: str
    ) -> Tuple[bool, str, str]:
        try:
            myGitLabAnalyzer = GitLabAnalyzer(token, hashedToken, url)
            self.__gitlab_list_lock.acquire()
            if self.__gitlab_list.get(hashedToken, None) is None:
                self.__gitlab_list[hashedToken] = myGitLabAnalyzer
            else:
                self.__update_last_access_time(hashedToken)
            self.__gitlab_list_lock.release()
            return True, "", myGitLabAnalyzer.username
        except gitlab.exceptions.GitlabAuthenticationError:
            return False, ERROR_CODES["invalidToken"], ""

    def __find_gitlab(self, hashedToken: str) -> Union[GitLabAnalyzer, None]:
        self.__gitlab_list_lock.acquire()
        myGitLab: GitLabAnalyzer = self.__gitlab_list.get(hashedToken, None)
        self.__update_last_access_time(hashedToken)
        self.__gitlab_list_lock.release()
        return myGitLab

    def __update_project_list_with_last_synced_time(
        self, hashedToken: str, projectList: list
    ) -> None:
        for project in projectList:
            isValid, _, _, myProject = self.__validate_token_and_project_state(
                hashedToken, project["id"]
            )
            if isValid:
                project["last_synced"] = myProject.last_synced
            else:
                project["last_synced"] = None

    def get_project_list(self, hashedToken: str) -> Tuple[bool, str, list]:
        myGitLab = self.__find_gitlab(hashedToken)
        if myGitLab is not None:
            projectList = myGitLab.get_all_gitlab_project_name_and_id()
            self.__update_project_list_with_last_synced_time(hashedToken, projectList)
            return True, "", projectList
        else:
            return False, ERROR_CODES["invalidToken"], []

    def __sync_project_helper(self, projectID: int, myAnalyzer: GitLabAnalyzer) -> None:
        myAnalyzer.update_project(projectID)

    def __get_project_analyzer_and_project(
        self, hashedToken: str, projectID: int
    ) -> Tuple[Union[GitLabAnalyzer, None], Union[GitLabProject, None]]:
        myProject = None
        myGitLabAnalyzer = self.__find_gitlab(hashedToken)
        if myGitLabAnalyzer is not None:
            myProject = myGitLabAnalyzer.get_gitlab_project_by_id(projectID)
        return myGitLabAnalyzer, myProject

    def __validate_token_and_project_state(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, Union[GitLabAnalyzer, None], Union[GitLabProject, None]]:
        myGitLab, myProject = self.__get_project_analyzer_and_project(
            hashedToken, projectID
        )

        if myGitLab is None:
            return False, ERROR_CODES["invalidToken"], myGitLab, None
        if myProject is None:
            return False, ERROR_CODES["invalidProjectID"], myGitLab, myProject
        elif myProject.is_syncing:
            return False, ERROR_CODES["projectIsSyncing"], myGitLab, myProject
        return True, "", myGitLab, myProject

    def sync_project(self, hashedToken: str, projectID: int) -> Tuple[bool, str]:
        isValid, errorCode, myGitLab, _ = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        if isValid:
            threading.Thread(
                target=self.__sync_project_helper, args=(projectID, myGitLab)
            ).start()
        return isValid, errorCode

    def sync_list_of_projects(
        self, hashedToken: str, projectList: list
    ) -> Tuple[bool, str, dict]:
        isAllSuccess = True
        response = {}

        if self.__find_gitlab(hashedToken) is None:
            return False, ERROR_CODES["invalidToken"], response
        else:
            for projectID in projectList:
                isValid, _, myGitLab, _ = self.__validate_token_and_project_state(
                    hashedToken, projectID
                )
                if isValid:
                    threading.Thread(
                        target=self.__sync_project_helper, args=(projectID, myGitLab)
                    ).start()
                    response[projectID] = True
                else:
                    isAllSuccess = False
                    response[projectID] = False
        if isAllSuccess:
            return True, "", response
        return False, ERROR_CODES["partialInvalidProjectID"], response

    def check_sync_state(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, dict]:
        myGitLab, myProject = self.__get_project_analyzer_and_project(
            hashedToken, projectID
        )

        if myGitLab is None:
            return False, ERROR_CODES["invalidToken"], {}
        if myProject is None:
            return False, ERROR_CODES["invalidProjectID"], {}

        return True, "", myProject.get_project_sync_state()

    def __get_sync_state_list(
        self, hashedToken: str, projectList: list
    ) -> Tuple[bool, int, dict]:
        totalProgress = 0
        response = {}
        isAllSuccess = True
        for projectID in projectList:
            myGitLab, myProject = self.__get_project_analyzer_and_project(
                hashedToken, projectID
            )
            if myProject is None:
                isAllSuccess = False
                continue
            syncState = myProject.get_project_sync_state()
            response[projectID] = syncState
            totalProgress += syncState["syncing_progress"]
        totalProgress = int((totalProgress / (len(projectList) * 100)) * 100)
        return isAllSuccess, totalProgress, response

    def check_project_list_sync_state(
        self, hashedToken: str, projectList: list
    ) -> Tuple[bool, str, dict, int]:
        myGitLab = self.__find_gitlab(hashedToken)
        if myGitLab is None:
            return False, ERROR_CODES["invalidToken"], {}, 0
        isAllSuccess, totalProgress, response = self.__get_sync_state_list(
            hashedToken, projectList
        )
        if isAllSuccess:
            return True, "", response, totalProgress
        return False, ERROR_CODES["partialInvalidProjectID"], response, totalProgress

    def get_project_members(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        projectMembers: list = []
        if isValid:
            projectMembers = myProject.get_members()
        return isValid, errorCode, projectMembers

    def get_project_users(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        userList: list = []
        if isValid:
            userList = myProject.user_list
        return isValid, errorCode, userList

    def get_project_master_commits(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        commitList: list = []
        if isValid:
            commitList = myProject.get_commit_list_on_master()
        return isValid, errorCode, commitList

    def get_project_master_direct_commits_by_user(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, dict]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        commitList: dict = {}
        if isValid:
            commitList = myProject.get_direct_commit_list_on_master_all_user()
        return isValid, errorCode, commitList

    def get_project_all_commits_by_user(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        commitList: list = []
        if isValid:
            commitList = myProject.get_commits_for_all_users()
        return isValid, errorCode, commitList

    def get_project_merge_request_by_user(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, dict]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        mergeRequestList: dict = {}
        if isValid:
            mergeRequestList = myProject.get_merge_request_and_commit_list_for_users()
        return isValid, errorCode, mergeRequestList

    def get_project_all_merge_request(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        mergeRequestList: list = []
        if isValid:
            mergeRequestList = myProject.get_all_merge_request_and_commit()
        return isValid, errorCode, mergeRequestList

    def get_code_diff(
        self, hashedToken: str, projectID: int, codeDiffID
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        codeDiff: list = []
        if isValid:
            codeDiff = myProject.get_code_diff(codeDiffID)
        return isValid, errorCode, codeDiff

    def get_all_project_notes(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, list]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        commentList: list = []
        if isValid:
            commentList = myProject.get_all_comments()
        return isValid, errorCode, commentList

    def get_project_notes_by_user(
        self, hashedToken: str, projectID: int
    ) -> Tuple[bool, str, dict]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        commentList: dict = {}
        if isValid:
            commentList = myProject.get_comments_for_all_users()
        return isValid, errorCode, commentList

    def reset_user_mapping(self, hashedToken: str, projectID: int) -> Tuple[bool, str]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        if isValid:
            myProject.reset_user_mapping()
            return isValid, errorCode
        return isValid, errorCode

    def __delete_GitLab_instance(self, hashedToken: str) -> None:
        self.__gitlab_list_lock.acquire()
        if self.__gitlab_list.get(hashedToken, None) is not None:
            self.__gitlab_list.pop(hashedToken)
        self.__gitlab_list_lock.release()

    def __garbage_monitor_worker(self, lock: threading.Lock) -> None:
        while self.__worker_should_run_signal:
            lock.acquire()
            gitLabUser: GitLabAnalyzer
            for key, gitLabUser in self.__gitlab_list:
                if (
                    datetime.datetime.now() - gitLabUser.last_time_access
                    > self.__maximum_exist_time
                ):
                    self.__gitlab_list.pop(key)
            lock.release()
            time.sleep(self.__worker_check_period)

    def start_garbage_monitor_thread(self) -> None:
        self.__worker_should_run_signal = True
        self.__garbage_monitor.start()

    def stop_garbage_monitor_thread(self) -> None:
        self.__worker_should_run_signal = False

    def change_worker_check_period(self, hours: int) -> None:
        self.__worker_check_period = self.__hour_to_seconds(hours)

    def get_garbage_monitor_check_period(self) -> int:
        return self.__worker_check_period

    def map_users(
        self, hashedToken: str, projectID: int, userMapDict: dict
    ) -> Tuple[bool, str]:
        isValid, errorCode, _, myProject = self.__validate_token_and_project_state(
            hashedToken, projectID
        )
        if isValid:
            myProject.call_map_users_to_members(userMapDict)
        return isValid, errorCode

    def update_config(
        self, hashedToken: str, configName: str, config: dict
    ) -> Tuple[bool, str]:
        myGitLab = self.__find_gitlab(hashedToken)
        if myGitLab is not None:
            myGitLab.configs[configName] = config
            return True, ""
        return False, ERROR_CODES["invalidToken"]

    def get_config(self, hashedToken: str) -> Tuple[bool, str, dict]:
        myGitLab = self.__find_gitlab(hashedToken)
        if myGitLab is not None:
            return True, "", myGitLab.configs
        return False, ERROR_CODES["invalidToken"], {}
