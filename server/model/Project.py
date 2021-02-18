from typing import Union, Optional, List, Tuple

class Project:
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
            deletion_date -> Optional[str]

            forks_count -> int
            star_count -> int

            owner -> Member

            tag_list -> List[str]
            issues_id_list -> List[int]
            merge_requests_id_list -> List[int]
            branches_id_list -> List[int]
            members_id_list -> List[id]
    """
    def __init__(self) -> None:
        self.__project_id: int
        self.__name: str
        self.__namespace: str
        self.__path_with_namespace: str
        self.__web_url: str
        self.__description: str

        self.__default_branch: str
        self.__visibility: str
        self.__is_archived: bool

        self.__created_date: str
        self.__updated_date: str
        self.__deletion_date: Optional[str]

        self.__fork_count: int
        self.__star_count: int

        self.__owner: None

        self.__tags_list: List[str]
        self.__issues_list: List[int]
        self.__branches_list: List[int]
        self.__members_list: List[int]

    # Getters
    @property
    def project_id(self) -> int:
        return self.__project_id 
    
    @property
    def project_name(self) -> str:
        return self.__name
    
    @property
    def project_namespace(self) -> str:
        return self.__namespace

    @property
    def project_path(self) -> str:
        slashIndex = self.__path_with_namespace.index('/') + 1
        return self.__path_with_namespace[slashIndex:]

    @property
    def project_path_with_namespace(self) -> str:
        return self.__path_with_namespace

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
    def deletion_date(self) -> Optional[str]:
        return self.__deletion_date
    
    @property
    def fork_count(self) -> int:
        return self.__fork_count
    
    @property
    def star_count(self) -> int:
        return self.__star_count

    @property
    def project_owner(self) -> None:
        return self.__owner