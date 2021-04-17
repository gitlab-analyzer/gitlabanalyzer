from model.data_object import DataObject
from typing import Union, Optional, List, Tuple
from gitlab.v4.objects import Project as gl_Project


class Project(DataObject):
    """
    attributes:
        project_id -> int
        name -> str
        description -> str
        web_url -> str
        path_with_namespace -> str
        runners_token -> str                        # TODO idk what this is, but it might be important

        default_branch -> str
        visibility -> str
        archived -> bool

        created_date -> str                         # ISO 8601 format
        updated_date -> str                         # ISO 8601 format

        forks_count -> int
        star_count -> int

        owner_id -> int

        tag_list -> List[str]
        # issues_id_list -> List[int]
        # merge_requests_id_list -> List[int]
        # branches_id_list -> List[int]
        # members_id_list -> List[id]
    """

    def __init__(self, gitlab_project: gl_Project) -> None:
        self.__project_id: int = gitlab_project.id
        self.__name: str = gitlab_project.name
        self.__namespace: str = gitlab_project.namespace['name']
        self.__path: str = gitlab_project.path
        self.__path_namespace = gitlab_project.namespace['path']
        self.__web_url: str = gitlab_project.web_url

        self.__visibility: str = gitlab_project.visibility
        self.__is_archived: bool = gitlab_project.archived

        self.__created_date: str = gitlab_project.created_at
        self.__updated_date: str = gitlab_project.last_activity_at

        # This line throws an error when testing on the SFU GitLab server
        # self.__owner_id: int = gitlab_project.owner['id']

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    # Getters
    @property
    def project_id(self) -> int:
        return self.__project_id

    @property
    def name(self) -> str:
        return self.__name

    @property
    def namespace(self) -> str:
        return self.__namespace

    @property
    def name_with_namespace(self) -> str:
        return "{} / {}".format(self.__name, self.__namespace)

    @property
    def path(self) -> str:
        return self.__path

    @property
    def path_namespace(self) -> str:
        return self.__path_namespace

    @property
    def path_with_namespace(self) -> str:
        return "{}/{}".format(self.path, self.path_namespace)

    @property
    def web_url(self) -> str:
        return self.__web_url

    @property
    def visibility(self) -> str:
        return self.__visibility

    @property
    def is_archived(self) -> bool:
        return self.__is_archived

    @property
    def created_date(self) -> str:
        return self.__created_date

    @property
    def updated_date(self) -> str:
        return self.__updated_date
