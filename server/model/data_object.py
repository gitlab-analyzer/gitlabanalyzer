import json


class DataObject:
    def __init__(self) -> None:
        self.__thisDict = {}

    def convert_class(self):
        classIdSubstr = "_{}__".format(self.__class__.__name__)
        for key, value in self.__dict__.items():
            if key != '_DataObject__thisDict':
                newKey = key.replace(classIdSubstr, "")
                self.__thisDict[newKey] = value

    def to_dict(self) -> dict:
        self.convert_class()
        return self.__thisDict

    def to_json(self) -> str:
        self.convert_class()
        return json.dumps(self.__thisDict)

    def __str__(self) -> str:
        self.convert_class()
        return self.to_dict().__str__()
