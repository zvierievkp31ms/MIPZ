import math

class CodeMetrics():
    def __init__(self, lines):
        self.__settings()
        self.__process_lines(lines)
    
    def __settings(self):
        self.empty_lines = 0
        self.commented_lines = 0
        self.logical_lines = 0
        self.cyclomatic_complexity = 0
        self.__reset_multiline()

        self.breakers = [':','(', ')']
        self.operators = ['=', '<', '>', '+', '-', '/', '*', '^', '&', '|', ';']
        self.logical_block_keywords = ['if', 'else', 'elif', 'try', 'except', 'finally', 'while', 'for', 'def']
        self.single_statements = ['break', 'continue', 'return', 'goto', 'raise', '=']

    def __reset_multiline(self):
        self.multiline_symbol = None
        self.multiline_comment = False

    def is_finite(self, value):
        return isinstance(value, (int, float)) and math.isfinite(value)
    
    def find_index(self, line, text):
        return line.find(text) if text in line else float('inf')

    def find_quotes_indexes(self, line):
        triple_quotes_index = self.find_index(line, '\'\'\'')
        triple_db_quotes_index = self.find_index(line, '\"\"\"')
        quotes_index = self.find_index(line, '\'')
        db_quotes_index = self.find_index(line, '\"')
        singleline_comment_index = self.find_index(line, '#')

        multiline_literal_index = min(triple_quotes_index, triple_db_quotes_index)
        singleline_literal_index = min(quotes_index, db_quotes_index)
        return multiline_literal_index, singleline_literal_index, singleline_comment_index
    
    def __delete_comments(self, line):
        res_line = line
        while True:
            slash_index = res_line.find('\\')
            if slash_index != -1:
                res_line = res_line[:slash_index] + res_line[slash_index + 2:]
                continue

            if self.multiline_symbol is None:
                multiline_literal_index, singleline_literal_index, singleline_comment_index = self.find_quotes_indexes(res_line)
                if singleline_literal_index < min(singleline_comment_index, multiline_literal_index):
                    singleline_literal_symbol = res_line[singleline_literal_index]
                    res_line = res_line[:singleline_literal_index] + res_line[singleline_literal_index + 1:]
                    singleline_literal_end_index = res_line.find(singleline_literal_symbol)
                    res_line = res_line[:singleline_literal_index] + res_line[singleline_literal_end_index + 1:]
                    continue

                if self.is_finite(multiline_literal_index) and multiline_literal_index < singleline_comment_index:
                    if multiline_literal_index == 0:
                        self.multiline_comment = True
                        self.commented_lines += 1
                    
                    self.multiline_symbol = res_line[multiline_literal_index:multiline_literal_index + 3]
                    res_line = res_line[:multiline_literal_index] + res_line[multiline_literal_index + 3:]
                    if self.multiline_symbol in res_line:
                        multiline_literal_end_index = res_line.find(self.multiline_symbol)
                        res_line = res_line[:multiline_literal_index] + res_line[multiline_literal_end_index + 3:]
                        self.__reset_multiline()
                        continue
                    else:
                        res_line = res_line[:multiline_literal_index].strip()
                        break
                else:
                    break
            elif self.multiline_symbol in res_line:
                multiline_end_index = res_line.find(self.multiline_symbol)
                res_line = res_line[multiline_end_index + 3:].strip()
                self.__reset_multiline()
                continue
            else:
                res_line = ''
                break
        
        if '#' in res_line:
            self.commented_lines +=1
            res_line = res_line[:res_line.find('#')].strip()
        
        return res_line
    
    def __divide_for_logical_unit(self, line):
        logical_parts = []
        logical_part = ''
        i = 0
        while i < len(line):
            char = line[i]
            if char == ' ' and len(logical_part) > 0:
                logical_parts.append(logical_part)
                logical_part = ''
            elif char in self.breakers:
                if len(logical_part) > 0:
                    logical_parts.append(logical_part)
                    logical_part = ''
                logical_parts.append(char)
            elif char in self.operators:
                if len(logical_part) > 0:
                    logical_parts.append(logical_part)
                    logical_part = ''
                nextChar = line[i+1] if i+1 < len(line) else None
                if nextChar in self.operators:
                    logical_parts.append(char + nextChar)
                    i += 1
                else:
                    logical_parts.append(char)
            else:
                logical_part += char
            i+=1
        if len(logical_part) > 0:
            logical_parts.append(logical_part)
        
        return logical_parts
    
    def __process_logical_line(self, line):
        logical_parts = self.__divide_for_logical_unit(line)
        logical_units = logical_parts[:]
        count = 0
        i=0
        while(i < len(logical_units)):
            unit = logical_parts[i]
            if unit == 'def':
                try:
                    colon_index = logical_units.index(':')
                except ValueError:
                    colon_index = len(logical_units)
                logical_units = [part for index, part in enumerate(logical_units) if index < i or index > colon_index]
                count += 1
            elif unit == '(':
                if (
                    i > 0 and
                    logical_units[i-1] not in self.single_statements and
                    logical_units[i-1] not in self.logical_block_keywords and
                    not all(char in self.operators for char in logical_units[i-1])
                ):
                    count += 1
            i+=1
        
        for unit in logical_units:
            if unit in self.single_statements or unit in self.logical_block_keywords:
                count += 1
            if unit in self.logical_block_keywords and unit != 'def':
                self.cyclomatic_complexity += 1
        
        self.logical_lines += count
    
    def __process_lines(self, code_lines):
        self.total_lines = len(code_lines)
        for line in code_lines:
            line = line.strip()

            if self.multiline_symbol is not None and self.multiline_comment:
                self.commented_lines += 1

            if len(line) == 0:
                self.empty_lines += 1
                continue
            
            res_line = self.__delete_comments(line)
            self.__process_logical_line(res_line)

    def getMetrics(self):
        return {
            'total_lines': self.total_lines,
            'empty_lines': self.empty_lines,
            'logical_lines': self.logical_lines,
            'commented_lines': self.commented_lines,
            'cyclomatic_complexity': self.cyclomatic_complexity
        }