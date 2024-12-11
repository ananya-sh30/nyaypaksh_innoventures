import re
import string

def alphanumeric(x):
    return re.sub(r'\w*\d\w*', '', str(x)) if isinstance(x, str) else x

def pun_lower(x):
    return re.sub(r'[%s]' % re.escape(string.punctuation), '', str(x).lower()) if isinstance(x, str) else x

def remove_n(x):
    return re.sub(r'\n', '', str(x)) if isinstance(x, str) else x

def remove_non_ascii(x):
    return re.sub(r'[^\x00-\x7f]', r'', str(x)) if isinstance(x, str) else x

def preprocess_input(input_text):
    input_text = alphanumeric(input_text)
    input_text = pun_lower(input_text)
    input_text = remove_n(input_text)
    input_text = remove_non_ascii(input_text)
    return input_text
