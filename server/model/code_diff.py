import gitlab


class CodeDiff:
    def __init__(self, codeDiffObject: dict):
        self.__new_file: bool = codeDiffObject["new_file"]
        self.__renamed_file: bool = codeDiffObject["renamed_file"]
        self.__deleted_file: bool = codeDiffObject["deleted_file"]
        self.__diff: str = codeDiffObject["diff"]
        self.__old_path: str = codeDiffObject["old_path"]
        self.__new_path: str = codeDiffObject["new_path"]
        self.__a_mode: str = codeDiffObject["a_mode"]
        self.__b_mode: str = codeDiffObject["b_mode"]

    @property
    def new_file(self) -> bool:
        return self.__new_file

    @property
    def renamed_file(self) -> bool:
        return self.__renamed_file

    @property
    def deleted_file(self) -> bool:
        return self.__deleted_file

    @property
    def diff(self) -> str:
        return self.__diff

    @property
    def old_path(self) -> str:
        return self.__old_path

    @property
    def new_path(self) -> str:
        return self.__new_path

    @property
    def a_mode(self) -> str:
        return self.__a_mode

    @property
    def b_mode(self) -> str:
        return self.__b_mode
