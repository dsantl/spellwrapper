#!/usr/bin/env python3

import multiprocessing as mp
import requests
import sys


def send_request(text):
    data = {'textarea': text}
    r = requests.post("http://hacheck.tel.fer.hr/xml.pl", data=data)
    return text, r.text


if __name__ == '__main__':

    THREAD_NUMBER = 5

    p = mp.Pool(THREAD_NUMBER)
    resulsts = p.map(send_request, sys.stdin.readlines())

    split_word = '!__ENDOFTEXT__!'
    end_rqs = '!__ENDRQS__!'

    for old, new in resulsts:
        sys.stdout.write(old + split_word + new + end_rqs)
