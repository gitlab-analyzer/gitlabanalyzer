from model.data_object import DataObject
from typing import Union, Optional
import gitlab
import re

"""
For comments from Issue / Merge Request:
* id => id of the comment itself. None if comment is on "Commit"
* noteable_type => Type of the note where comment is written
    (Ex. "Issue", "MergeRequest").
* noteable_id => id/sha of the note.
    (Ex. Issue id #28330, Commit sha 8640481e)
* noteable_iid => iid of the note.
    (Ex. Issue iid #1) None if comment is on "Commit"

For comments from Commit:
* body == "note" attribute of json
* noteable_id == "sha" attribute from GET parameters
* id, noteable_iid will be None

General note:
* noteable_type => whether comment is on Issue / MergeRequest / Commit
* ownership => either "Own" (if comment on own MR/Isue/Commit) or "Other" (if comment on other's MR/Issue/Commit)
* owner_of_notable => name of the author who created the MR/Issue/Commit

"""


class Comment(DataObject):
    def __init__(
        self,
        commentForIssueMR: gitlab = None,
        commentForCommit: gitlab = None,
        author_of_notable: str = None,
        commitSha: str = None,
    ) -> None:
        if commentForIssueMR:  # comment of MergeRequest/Issue
            self.__author: str = commentForIssueMR.author["name"]
            self.__body: str = commentForIssueMR.body
            self.__created_date: str = commentForIssueMR.created_at
            self.__noteable_id: Union[int, str] = commentForIssueMR.noteable_id
            # whether comment is on Issue / MergeRequest / Commit
            self.__noteable_type: str = commentForIssueMR.noteable_type
            # Ex. Issue #1
            self.__noteable_iid: Optional[int] = commentForIssueMR.noteable_iid
            self.__id: Optional[int] = commentForIssueMR.id
            self.__word_count = len(re.findall(r'\w+', self.__body))
            self.__owner_of_noteable: str = author_of_notable
            self.__ownership: str = self.__define_ownership()  # either own, other
        elif commentForCommit and commitSha:  # comment of Commit
            self.__author: str = commentForCommit.author["name"]
            self.__body: str = commentForCommit.note
            self.__created_date: str = (
                commentForCommit.created_at
            )  # datetime in ISO 8601 format
            self.__noteable_id: Union[int, str] = commitSha
            self.__noteable_type: str = "Commit"
            self.__noteable_iid: Optional[int] = None
            self.__id: Optional[int] = None
            self.__word_count = len(re.findall(r'\w+', self.__body))
            self.__owner_of_noteable: str = author_of_notable
            self.__ownership: str = self.__define_ownership()
        else:
            raise Exception("Comment constructor parameters cannot all be None.")

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

    def __define_ownership(self) -> str:
        if self.__author == self.__owner_of_noteable:
            return "Own"
        return "Other"

    # Getters

    @property
    def author(self) -> int:
        return self.__author

    @property
    def body(self) -> str:
        return self.__body

    @property
    def created_date(self) -> str:
        return self.__created_date

    @property
    def noteable_id(self) -> Union[int, str]:
        return self.__noteable_id

    @property
    def noteable_type(self) -> str:
        return self.__noteable_type

    @property
    def noteable_iid(self) -> Optional[int]:
        return self.__noteable_iid

    @property
    def id(self) -> Optional[int]:
        return self.__id

    @property
    def word_count(self):
        return self.__word_count

    @property
    def ownership(self):
        return self.__ownership

    @property
    def owner_of_noteable(self):
        return self.__owner_of_noteable
