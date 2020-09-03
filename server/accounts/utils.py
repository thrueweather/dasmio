from random import randint


def generate_four_digit_code():
    code = ''
    for i in range(0, 4):
        code += str(randint(0, 9))

    return code
