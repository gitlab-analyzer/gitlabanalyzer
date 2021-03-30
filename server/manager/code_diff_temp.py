import re
from typing import Union, Optional, List
from model.code_diff import *
import gitlab


class CodeDiffAnalyzer:
    def __init__(self) -> None:
        self.__codeDiffList: List[CodeDiff] = []
        self.__listSize: int = 0

    # TODO: a way to fill the code diff list

    # The ID's of the codeDiffs are their index in the list
    def get_code_diff_by_id(self, codeDiffId: int) -> list: #done
        return self.__codeDiffList[codeDiffId] if codeDiffId < self.__listSize else []

    def get_code_diff_statistic(self, codeDiffObject: CodeDiff) -> None:

        # TODO:
        # Case where the commit diff is a block of comment
        # Case where there is some insertion into the middle of a line of code
        # without any deletion (current code will mark it as one addition and one deletion)
        # This need to be just one addition
        # Assert no new line thing that gitlab have

        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }

        oldLine = " "
        python = False
        block_code = False

        self.check_for_code_type(codeDiffObject)

        diffCode = codeDiffObject
        for line in diffCode.diff.splitlines():
            if line[0] == '+' or line[0] == '-':
                
                #Check for block of comments
                #-------------------------------------------------
                if python is False:
                    if block_code == True and "*/" not in line:
                        info = self.modify_info_value("comments", info, line[0])
                        continue

                    if "/*" in line:
                        if "*/" in line:
                            info = self.modify_info_value("comments", info, line[0])
                        else:
                            info = self.check_block_comments(line,python, info,block_code)
                            block_code = True
                        continue

                    if "*/" in line:
                        info = self.check_block_comments(line,python, info,block_code)
                        block_code = False
                        continue
                else:
                    if block_code == True and "'''" not in line:
                        info = self.modify_info_value("comments", info, line[0])
                        continue

                    if "'''" in line:
                        if line.count("'''") == 2:
                            info = self.modify_info_value("comments", info, line[0])
                        else:
                            info = self.check_block_comments(line,python, info,block_code)
                            block_code = not block_code
                        continue
                #-------------------------------------------------

                #Adding to middle of the line instead of to the front or the back
                #-------------------------------------------------
                if line[0] != oldLine[0] and abs(len(line) - len(oldLine)) == 1:
                    temp = info.copy()
                    info = self.check_middle_syntax_addition(
                        line, oldLine, info, python
                    )
                    if temp != info:
                        info = self.modify_info_value("lines", info, oldLine[0])
                        continue
                #-------------------------------------------------

                #Adding to an exisiting line
                #-------------------------------------------------
                if oldLine[1:] in line[1:] and oldLine[0] != line[0]:
                    if oldLine != " " and line[1:] != oldLine[1:]:
                        info = self.modify_info_value("lines", info, oldLine[0])
                        tempLine = '+' + line[1:].replace(oldLine[1:], '')
                        info = self.modify_to_a_new_line(
                            info,
                            tempLine,
                            python,
                        )
                        continue

                if line[1:] in oldLine[1:] and oldLine[0] != line[0]:
                    if oldLine != " " and line[1:] != oldLine[1:]:
                        info = self.modify_info_value("lines", info, oldLine[0])
                        tempLine = '-' + oldLine[1:].replace(line[1:], '')
                        info = self.modify_to_a_new_line(
                            info,
                            tempLine,
                            python,
                        )
                        continue
                #-------------------------------------------------

                #Normal case
                #-------------------------------------------------
                info = self.modify_to_a_new_line(
                    info,
                    line,
                    python,
                )
                oldLine = line
                #-------------------------------------------------

        return info

    def modify_to_a_new_line(self, info, line, python) -> dict: #done

        if len(line) == 1:
            info = self.modify_info_value("blanks",info,line)
            return info

        temp = info.copy()
        info = self.check_for_spacing_syntax_or_comment(
            line[0:1], info, line[1:], python
        )
        if info != temp:
            return info

        info = self.modify_info_value("lines",info,line[0])
        return info

    def check_for_spacing_syntax_or_comment(self, signal, info, str, python) -> dict: #done

        isSyntax = False
        syntaxStr = {"{","}",";","(",")"}

        if str.isspace():
            info["spacing_changes"] = info["spacing_changes"] + 1
            return info

        for i in range(0,len(str)):
            if python:
                if str[i] == ':' or str[i] == "(" or str[i] == ")":
                    isSyntax = True
                    continue
                if str[i] == "#" and isSyntax is False:
                    info = self.modify_info_value("comments",info,signal)
                    return info
            else:
                if str[i] in syntaxStr:
                    isSyntax = True
                    continue
                if str[i:i+2] == '//' and isSyntax is False:
                    info = self.modify_info_value("comments",info,signal)
                    return info
            if str[i] != " ":
                info = self.modify_info_value("lines",info,signal)
                return info

        if isSyntax:
            info["syntax_changes"] = info["syntax_changes"] + 1
        return info

    def check_for_code_type(self, codeDiffObject: CodeDiff) -> bool: #done
        diffCode = codeDiffObject
        fileName = diffCode.new_path
        found = re.search('\.(.+?)$', fileName)
        if found is not None:
            if found.group(1) == 'py':
                return True
        return False

    def check_middle_syntax_addition(self, line, oldLine, info, python) -> dict: #done
        temp = 0
        syntaxStr = {"{","}",";","(",")"}

        if len(line) > len(oldLine):
            length = len(oldLine)
        else:
            length = len(line)

        for i in range(0, length - 1):
            if oldLine[i] != line[i]:
                temp = i
                break

        if temp != 0:
            if oldLine[temp] == " " or line[temp] == " ":
                info["spacing_changes"] = info["spacing_changes"] + 1
            elif oldLine[temp] == ":" or line[temp] == ":":
                if python:
                    info["syntax_changes"] = info["syntax_changes"] + 1
            elif oldLine[temp] in syntaxStr or oldLine[temp] in syntaxStr:
                if python is False:
                    info["syntax_changes"] = info["syntax_changes"] + 1
            else:
                info = self.modify_info_value("lines", info, line[0])

        return info

    def check_block_comments(self,line,python, info,block_code) -> dict:
        temp = 0
        
        for i in range(0, len(line)):
            if python is False:
                if line[i:i+2] == "/*":
                    temp = i
                if line[i:i+2] == "*/":
                    temp = i+2
            else:
                if line[i:i+3] == "'''":
                    temp = i
        
        if python is False:
            if line[temp:temp+2] == "/*":
                if (line[1:temp].isspace() or line[1:temp] == "") and line[temp+2:] != "" and line[temp+2:].isspace() is False:
                    info = self.modify_info_value("comments", info, line[0])
                elif line[1:temp].isspace() or line[1:temp] == "" and line[temp+2:].isspace() or line[temp+2:] == "":
                    info["syntax_changes"] = info["syntax_changes"] + 1
                else:
                    info = self.modify_to_a_new_line (info, line[0:temp],python) 
            if line[temp-2:temp] == "*/":
                if (line[temp:].isspace() or line[temp:] == "") and line[1:temp-2] != "" and line[1:temp-2].isspace() is False:
                    info = self.modify_info_value("comments", info, line[0])
                elif line[1:temp-2].isspace() or line[1:temp-2] == "" and line[temp:].isspace() or line[temp:] == "":
                    info["syntax_changes"] = info["syntax_changes"] + 1
                else:
                    info = self.modify_to_a_new_line (info, line[0]+line[temp:],python) 
        else:
            if block_code:
                if (line[temp+3:].isspace() or line[temp+3:] == "") and line[1:temp] != "" and line[1:temp].isspace() is False:
                    info = self.modify_info_value("comments", info, line[0])
                elif line[1:temp].isspace() or line[1:temp] == "" and line[temp+3:].isspace() or line[temp+3:] == "":
                    info["syntax_changes"] = info["syntax_changes"] + 1
                else:
                    info = self.modify_to_a_new_line (info, line[0]+line[temp+3:],python) 
            else:
                if (line[1:temp].isspace() or line[1:temp] == "") and line[temp+3:] != "" and line[temp+3:].isspace() is False:
                    info = self.modify_info_value("comments", info, line[0])
                elif line[1:temp].isspace() or line[1:temp] == "" and line[temp+3:].isspace() or line[temp+3:] == "":
                    info["syntax_changes"] = info["syntax_changes"] + 1
                else:
                    info = self.modify_to_a_new_line (info, line[0:temp],python) 
        return info

    def modify_info_value(self, info_name, info, signal) -> dict: #done
        if signal == '+':
            info[info_name + "_added"] = info[info_name + "_added"] + 1
        if signal == '-':
            info[info_name + "_deleted"] = info[info_name + "_deleted"] + 1
        return info

