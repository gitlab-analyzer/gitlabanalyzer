
# GET /projects/:id/issues

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
        pass
