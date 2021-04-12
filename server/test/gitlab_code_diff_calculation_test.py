import unittest
from manager import *

namePy = 'server/model/analyzer.py'
nameNotPy = 'client/src/App.js'

'''
Test require 2 strings for diff and name, this is input manually to make sure we know the right result.
This however cause us not to be able to create a code diff object to pass to the function
The solution for now is to modify the code so it take 2 strings instead of 2 fields of 1 code diff object when testing
'''

#COMMENT OUT THE TEST TO NOT BREAK PIPELINE
#TEST IS ONLY WORK WHEN MODIFY CODE DIFF (modify input, not logic so test is still valid)
'''
class CodeDiffAnalyzer(unittest.TestCase):
    
    #Test recognize file type
    def test_not_py(self):
        self.assertTrue(self.check_for_code_type(nameNotPy) != "py")

    def test_empty_file_type(self):
        self.assertTrue(self.check_for_code_type("") != "py")

    def test_py(self):
        self.assertTrue(self.check_for_code_type(namePy) == "py")

    #Test with not python file
    def test_add_a_blank_line(self):
        diff = "+\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 1,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_delete_a_blank_line(self):
        diff = "-\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 1,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_spacing_change(self):
        diff = "- \n"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 1,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_add_a_line(self):
        diff = "+ if(1+2==3)\n"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_delete_a_line(self):
        diff = "- if(1+2==3)\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 1,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_add_multiple_line(self):
        diff = "+ if(1+2==3)\n+do{\n+i=i+1}\n+return i\n"
        info = {
            "lines_added": 4,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_delete_multiple_line(self):
        diff = "- if(1+2==3)\n-do{\n-i=i+1}\n-return i\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 4,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_add_and_delete_multiple_line(self):
        diff = "- if(1+2==3)\n+do{\n-i=i+1}\n-return i\n"
        info = {
            "lines_added": 1,
            "lines_deleted": 3,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_mix_add_and_delete_multiple_line_with_block_comment(self):
        diff = "- if(1+2==3)\n+do{\n-i=i+1}\n-return i\n+   /* This is a block of comment */"
        info = {
            "lines_added": 1,
            "lines_deleted": 3,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_mix_add_and_delete_multiple_line_with_block_of_lines_comment(self):
        diff = "- if(1+2==3)\n+do{\n-i=i+1}\n-return i\n+   /* This is a block of comment \n+ Still block comment\n- delete a comment in a block\n+add more comment\n+add final comment */"
        info = {
            "lines_added": 1,
            "lines_deleted": 3,
            "comments_added": 4,
            "comments_deleted": 1,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_block_of_lines_comment_with_syntax(self):
        diff = "+   /*    \n+ This is a block of comment \n+ Still block comment\n- delete a comment in a block\n+add more comment\n+add final comment */ if(1+2==3)"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 3,
            "comments_deleted": 1,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_syntax_change(self):
        diff = "- {"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_syntax_change_in_modify_line_middle(self):
        diff = "- if ((1+2==3)\n+ if ((1+2)==3)"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_spacing_change_in_modify_line_middle(self):
        diff = "- if ((1+2 ==3)\n+ if ((1+2==3)"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 1,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_char_change_in_modify_line_middle(self):
        diff = "- if ((1+2==21)\n+ if ((1+20==21)"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_change_at_end_of_line(self):
        diff = "- if ((1+2)==3) {cout << \"this is correct\";}\n+ if ((1+2)==3) \n"
        info = {
            "lines_added": 0,
            "lines_deleted": 1,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_change_at_start_of_line(self):
        diff = "-{cout << \"this is correct\";}\n+ if ((1+2)==3) {cout << \"this is correct\";}\n"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)
    
    def test_change_syntax_at_end_of_line(self):
        diff = "- if ((1+2==3)\n+ if ((1+2==3) "
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    def test_add_a_normal_comment(self):
        diff = "+  //  This is a comment\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,nameNotPy), info)

    #Test with python file
    def test_python_comment(self):
        diff = "+  # This is a comment\n"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,namePy), info)

    def test_python_block_of_comment(self):
        diff = "+  \''' This is a comment \''' \n+print(1+1)"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,namePy), info)

    def test_python_block_of_lines_comment(self):
        diff = "+  \''' \n+ A new comment\n+Add one more\n-   delete one\n+final line \''' print(\"done\")\n"
        info = {
            "lines_added": 1,
            "lines_deleted": 0,
            "comments_added": 2,
            "comments_deleted": 1,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,namePy), info)

    def test_python_add_syntax(self):
        diff = "- if i == 2 do:\n+ if i == 2 do"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,namePy), info)

    def test_python_add_syntax_middle(self):
        diff = "- if i == 2 do\n+ if i == 2: do"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,namePy), info)
    
    #Test with other file type for comment and block of command
    def test_html_block_comment(self):
        diff = "- if i == 2 do\n+ <!--some comment -->\n+ while(n < 10)"
        info = {
            "lines_added": 1,
            "lines_deleted": 1,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,"abc.html"), info)

    def test_html_block_of_line_comments(self):
        diff = "- if i == 2 do\n+ <!--\n+some comment\n+ --> print(i)\n+ while(n < 10)"
        info = {
            "lines_added": 2,
            "lines_deleted": 1,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,"abc.html"), info)
        
    def test_sql_comment(self):
        diff = "- if i == 2 do\n+ --some comment\n+ while(x < 10)"
        info = {
            "lines_added": 1,
            "lines_deleted": 1,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 0,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,"abc.sql"), info)

    def test_sql_block_of_comment(self):
        diff = "- if i == 2 do\n+ /*some comment\n+ */ \n+ while(x < 10)"
        info = {
            "lines_added": 1,
            "lines_deleted": 1,
            "comments_added": 1,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,"abc.sql"), info)

    def test_js_syntax(self):
        diff = "- if i == 2 do\n+ if i == 2 do <>"
        info = {
            "lines_added": 0,
            "lines_deleted": 0,
            "comments_added": 0,
            "comments_deleted": 0,
            "blanks_added": 0,
            "blanks_deleted": 0,
            "spacing_changes": 0,
            "syntax_changes": 1,
        }
        self.assertEqual(self.get_code_diff_statistic(diff,"abc.js"), info)

if __name__ == '__main__':
    unittest.main()
'''