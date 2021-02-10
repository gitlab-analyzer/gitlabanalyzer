from typing import Union, Optional, List

class Commit:

	def __init__(self, id, author, title, committed_date, conflicts=None, comments=None) -> None:
	    self.__id: Union[int, str] = id
	    self.__author: str = author
	    self.__title: str = title
	    self.__committed_date: str = committed_date  #datetime in ISO 8601 format
	    self.__conflicts: Optional[List[str]] = conflicts

	#Getters
	
	@property
	def id(self) -> Union[int, str]:
		return self.__id
	
	@property
	def author(self) -> str:
		return self.__author
	
	@property
	def title(self) -> str:
		return self.__title
	
	@property
	def committed_date(self) -> str:
		return self.__committed_date

	@property
	def conflicts(self) -> Optional[List[str]]:
		return self.__conflicts
