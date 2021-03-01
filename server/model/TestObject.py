from model.DataObject import DataObject

class _TestDataObject(DataObject):
    """Test Class"""
    def __init__(self) -> None:
        self.__a = 1
        self.__b = "bee"
        self.__c = "\"see\""
        self.pub = "public"

        # super().__init__() MUST BE AFTER CURRENT CLASS CONSTRUCTION IS DONE
        super().__init__()

if __name__ == "__main__":
    t = _TestDataObject()
    print(t.__dict__)
    print(t.to_dict())
    print(t.to_json())
    print(t.__dict__)