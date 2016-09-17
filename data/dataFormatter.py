#!/usr/env/python

"""Script handles sorting the dummy data into something ready for importing
into the DB"""

# following constants define the columns of data in data_file
FIRST_NAME = 0
LAST_NAME = 1
DSITI_EMAIL = 2
DEPARTMENT = 3
JOB = 4
PHONE = 5
NEWSLETTER = 6
DATE = 7
# Time column from the file is not required for this database

IP = 0
IP_DATE = 1

# defines whether the script ignores the first row
IGNORE_FIRST_ROW = True


def read_data(filename):
    """ (str) -> array(array(str))

    Function takes as input a filename that refers to a file of dummy data.
    It returns a 2-dimensional array of string, containing the desired
    contents of the data.

    Note: function assumes datafile is a csv-type file that contains the
    columns - First name, Last name, DSITI email, Department, Job title,
        Work phone, Newsletter, Date. Anything beyond these columns is ignored.

    """
    data = []
    with open(filename, 'r') as data_file:
        for i, line in enumerate(data_file):
            if i == 0 and IGNORE_FIRST_ROW:
                continue
            line_as_array = []
            line_split = line.split(",")
            desired_columns = choose_columns()
            for index in desired_columns:
                # handle NEWSLETTER and DATE columns specially
                if index == DATE:
                    line_as_array.append(date_formatted(line_split[index]))
                elif index == NEWSLETTER:
                    line_as_array.append(news_formatted(line_split[index]))
                else:
                    line_as_array.append(line_split[index])
            data.append(line_as_array)

    return data


def read_ip_data(filename):
    """ (str) -> array(array(str))

    Function takes as input a filename that refers to a file of dummy data.
    It returns a 2-dimensional array of string, containing the desired
    contents of the data.

    Note: function assumes datafile is a csv-type file that contains the
    columns - First name, Last name, DSITI email, Department, Job title,
        Work phone, Newsletter, Date. Anything beyond these columns is ignored.

    """
    data = []
    with open(filename, 'r') as data_file:
        for i, line in enumerate(data_file):
            if i == 0 and IGNORE_FIRST_ROW:
                continue
            line_as_array = []
            line_split = line.split(",")
            desired_columns = choose_ip_columns()
            for index in desired_columns:
                # handle DATE column specially
                if index == DATE:
                    line_as_array.append(date_formatted(line_split[index]))
                else:
                    line_as_array.append(line_split[index])
            data.append(line_as_array)

    return data


def write_data(data, filename):
    """ (array(array(str)), str) -> None

    Function takes as input a 2-dimensional array of str and writes it to a
    CSV-type file with the given filename.

    """
    with open(filename, 'w') as out_file:
        for line_as_array in data:
            out_file.write(",".join(line_as_array) + "\n")


def write_ip_data(data, filename):
    """ (array(array(str)), str) -> None

    Function takes as input a 2-dimensional array of str and writes it to a
    CSV-type file with the given filename.

    """
    with open(filename, 'w') as out_file:
        for line_as_array in data:
            out_file.write(",".join(line_as_array))


def choose_columns():
    """ () -> array(int)

    Function returns an array of int representing the indices of the desired
    columns.

    """
    # defines which columns are desired
    return [FIRST_NAME, LAST_NAME, DSITI_EMAIL, DEPARTMENT, JOB, PHONE,
            NEWSLETTER, DATE]


def choose_ip_columns():
    """ () -> array(int)

    Function returns an array of int representing the indices of the desired
    columns.

    """
    # defines which columns are desired
    return [IP, IP_DATE]


def date_formatted(date):
    """ (str) -> str

    Function takes as string a date formatted as M/D/YYYY and returns the same
    date formatted as YYYY-MM-DD.

    """
    date_split = date.split("/")
    month = date_split[0]
    day = date_split[1]
    year = date_split[2]

    if int(month) < 10:
        month = "0" + month
    if int(day) < 10:
        day = "0" + day

    return "-".join([year, month, day])


def news_formatted(boolean):
    """ (str) -> str

    Function takes as string an indication of a boolean value; i.e., either
    'yes' or 'no', and returns a '1' or '0' respectively.

    """
    try:
        assert(boolean == "yes" or boolean == "no")
    except AssertionError:
        raise ValueError(boolean + " is neither 'yes' nor 'no'")

    if boolean == "yes":
        return '1'
    elif boolean == "no":
        return '0'


def format_guest_data(in_file, out_file):
    dummy_data = read_data(in_file)
    write_data(dummy_data, out_file)


def format_ip_data(in_file, out_file):
    dummy_data = read_ip_data(in_file)
    write_ip_data(dummy_data, out_file)


if __name__ == "__main__":
    # format_guest_data("dummy-data.csv", "formatted-guest-dummy-data.csv")
    format_ip_data("dummy-data.csv", "formatted-ip-dummy-data.csv")
    print("formatted data file written")
