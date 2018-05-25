import stat
import sys
import os


def mkdir_p(path):
    """Mimics functionality of bash 'mkdir -p'"""
    try:
        os.makedirs(path)
    except OSError as exc:
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def read_file_to_lines(root_dir, filename, trim_newlines):
    try:
        with open(root_dir + '/' + filename, 'r') as input_file:
            if trim_newlines:
                string_array = input_file.read().split('\n')
            else:
                string_array = input_file.readlines()
    except IOError:
        sys.exit('Cannot find file %s in root path...Exiting!' % filename)
    while '' in string_array:
        string_array.remove('')
    return string_array


def write_lines_to_file(file_path, lines):
    with open(file_path, 'w') as output_file:
        output_file.writelines(lines)


def write_file_as_rx(filename, string_lines):
    """Writes string to file, setting permissions as read-only and executable"""
    with open(filename, 'w') as writefile:
        writefile.writelines(string_lines)
    os.chmod(filename, stat.S_IRUSR | stat.S_IXUSR | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)


def find_and_replace_line(filename, substitution_dict):
    """Reads lines of file at path filename into string array, looking for and substituting
    lines which match patterns given in substitution_dict (including newline in substitute will replace multiple lines)"""
    with open(filename, 'r') as readfile:
        lines = readfile.readlines()
    lines_to_find = substitution_dict.keys()
    for line in range(len(lines)):
        for target in lines_to_find:
            found_regexp = lines[line].find(target)
            if found_regexp != -1:
                substitute = substitution_dict[target].split('\n')
                for substitute_line in substitute:
                    lines[line] = substitute_line
                    if substitute_line != '':
                        lines[line] += '\n'
                    line += 1
                line -= 1
    return lines


def find_and_replace_regexp(filename, substitution_dict):
    """Reads lines of file at path filename into string array, looking for and substituting
    expressions which match patterns given in substitution_dict"""
    with open(filename, 'r') as readfile:
        lines = readfile.readlines()
    lines_to_find = substitution_dict.keys()
    for line in range(len(lines)):
        for target in lines_to_find:
            found_regexp = lines[line].find(target)
            if found_regexp != -1:
                lines[line] = lines[line].replace(target, substitution_dict[target])
    return lines


def copy_and_merge(source_files, destination):
    """Read all lines from each file path in list source_files and writes to single file at destination"""
    with open(destination, 'w') as destination_file:
        for source_file in source_files:
            with open(source_file, 'r') as source_part:
                source_part_lines = source_part.readlines()
                for line in source_part_lines:
                    destination_file.write(line)
