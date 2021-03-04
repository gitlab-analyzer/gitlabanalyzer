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
        self.__namespace: str = gitlab_project.namespace.name
        self.__path: str = gitlab_project.path
        self.__path_namespace = gitlab_project.namespace.path
        self.__web_url: str = gitlab_project.web_url
        self.__description: str = gitlab_project.description

        self.__default_branch: str = gitlab_project.default_branch
        self.__visibility: str = gitlab_project.visibility
        self.__is_archived: bool = gitlab_project.archived

        self.__created_date: str = gitlab_project.created_at
        self.__updated_date: str = gitlab_project.last_activity_at

        self.__fork_count: int = gitlab_project.forks_count
        self.__star_count: int = gitlab_project.star_count

        self.__owner_id: int = gitlab_project.owner.id

        self.__tags_list: List[str] = gitlab_project.tag_list

        # self.__issues_list: List[int]
        # self.__branches_list: List[int]
        # self.__members_list: List[int]

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    # Getters
    @property
    def tags_list(self) -> Tuple[str]:
        return tuple(self.__tags_list)

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
    def description(self) -> str:
        return self.__description

    @property
    def default_branch(self) -> str:
        return self.__default_branch

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
    
    @property
    def fork_count(self) -> int:
        return self.__fork_count
    
    @property
    def star_count(self) -> int:
        return self.__star_count

    @property
    def owner_id(self) -> int:
        return self.__owner_id
