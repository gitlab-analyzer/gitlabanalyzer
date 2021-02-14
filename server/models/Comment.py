from typing import Union, Optional

"""
For comments from Issue / Merge Request:
* id => id of the comment itself. None if comment is on "Commit"
* noteable_type => Type of the note where comment is written (Ex. "Issue", "MergeRequest").
* noteable_id => id/sha of the note. (Ex. Issue id #28330, Commit sha 8640481e)
* noteable_iid => iid of the note. (Ex. Issue iid #1) None if comment is on "Commit"

For comments from Commit:
* body == "note" attribute of json
* noteable_id == "sha" attribute from GET parameters
* id, noteable_iid will be None

"""

class Comment:

	def __init__(self, author, body, created_date, noteable_id, noteable_type, noteable_iid=None, id=None) -> None:
		self.__author: int = author #Author id
		self.__body: str = body
		self.__created_date: str = created_date  #datetime in ISO 8601 format
		self.__noteable_id: Union[int, str] = noteable_id  	#Ex. Issue of id #28830
		self.__noteable_type: str = noteable_type  #whether comment is on Issue / MergeRequest / Commit
		self.__noteable_iid: Optional[Union[int, str]] = noteable_iid # Ex. Issue #1
		self.__id: Optional[int] = id 	#id of the comment itself

	def to_json(self) -> str:
		return self.__dict__.__str__().replace("_Comment__", "").replace("'", "\"")

	def __str__(self) -> str:
		return self.__dict__.__str__()

	#Getters

	@property
	def id(self) -> Optional[int]:
		return self.__id

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
	def noteable_iid(self) -> Optional[Union[int, str]]:
		return self.__noteable_iid


"""
#Test

test = Comment(123, "body", "CREATED date", 28830, "Issue", noteable_iid=1, id=12345)

print(test)
print("_______")
print(test.to_json())

"""
