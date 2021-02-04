from typing import Union, Optional

class Issue:
    """
        attributes:     
            issue_id -> int                 # the issue's number in the context of the project
            upvotes -> int
            downvotes -> int
            merge_requests_count -> int     # number of merge requests made for the issue
            id -> int                       # TODO: find out what this represents

            title -> str
            description -> str
            state -> str                    # where the issue is on the issues board e.g. "Open", "Closed", "In Progress", etc.
            updated_date -> str               # string datetime in ISO 8601 format (updated_at)
            created_date -> str               # string datetime in ISO 8601 format (created_at)
            closed_at -> str                # string datetime in ISO 8601 format (closed_at)
            due_date -> str                 # string datetime in ISO 8601 format
            project_id -> Union[int, str]   # project ID or URL-encoded path of the project

            milestone -> Milestone
            author -> User

            assignees_list -> List[User]
            comments_list -> List[Comment]
            labels_list -> List[str]        # list of tags/labels e.g. "Critical", "Back-End", etc.

        methods:
            Getters for all attributes
    """

    def __init__(self):
        self._issue_id: int = None
        self._upvotes: int = None
        self._downvotes: int = None
        self._merge_requests_count: int = None

        self._title: str = None
        self._description: str = None
        self._state: str = None
        self._updated_date: str = None
        self._created_date: str = None
        self._closed_date: Optional[str] = None
        self._due_date: Optional[str] = None
        self._project_id: Union[int, str] = None

        self._milestone = None
        self._author = None

        self._assignees_list = None
        self._comments_list = None
        self._labels_list = None

    # Getters
    @property
    def issue_id(self) -> int:
        return self._issue_id

    @property
    def upvotes(self) -> int:
        return self._upvotes

    @property
    def downvotes(self) -> int:
        return self._downvotes

    @property
    def merge_requests_count(self) -> int:
        return self._merge_requests_count

    @property
    def title(self) -> str:
        return self._title

    @property
    def description(self) -> str:
        return self._description

    @property
    def state(self) -> str:
        return self._state

    @property
    def updated_date(self) -> str:
        return self._updated_date

    @property
    def created_date(self) -> str:
        return self._created_date

    @property
    def closed_date(self) -> Optional[str]:
        return self._closed_date

    @property
    def due_date(self) -> Optional[str]:
        return self._due_date

    @property
    def project_id(self) -> Union[int, str]:
        return self._project_id
