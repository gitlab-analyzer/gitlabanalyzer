import json


class DataObject:
    def __init__(self) -> None:
        self.__thisDict = {}

        classIdSubstr = "_{}__".format(self.__class__.__name__)
        for key, value in self.__dict__.items():
            if key != '_DataObject__thisDict':
                newKey = key.replace(classIdSubstr, "")
                self.__thisDict[newKey] = value

    def to_dict(self) -> dict:
        return self.__thisDict

    def to_json(self) -> str:
        return json.dumps(self.__thisDict)

    def __str__(self) -> str:
        return self.to_dict().__str__()
