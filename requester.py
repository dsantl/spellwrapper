#!/usr/bin/env python3

import sys
import requests
import time
import threading
import queue


def send_request(text, answer_queue, thread_queue, id):
    rqs = {"textarea": text}
    r = requests.post("http://hacheck.tel.fer.hr/xml.pl", data=rqs)
    answer_queue.put((id, (text, r.text)))
    thread_queue.get()
    answer_queue.task_done()


def main():
    rqs_limit = 2000
    max_threads = 5

    answer_queue = queue.Queue()
    thread_queue = queue.Queue()
    thread_list = list()

    cnt = 0
    splitWord = "!__ENDOFTEXT__!"
    endRQS = "!__ENDRQS__!"

    for line in iter(sys.stdin.readline, ''):

        while thread_queue.qsize() > max_threads:
            pass

        thread_queue.put(cnt)
        t = threading.Thread(
            target=send_request, args=(line, answer_queue, thread_queue, cnt))
        t.daemon = True
        t.start()
        thread_list.append(t)

        cnt += 1
        if cnt > rqs_limit:
            break
        time.sleep(1)

    answer_queue.join()
    for t in thread_list:
        t.join()

    answer_list = [None]*answer_queue.qsize()
    while not answer_queue.empty():
        id, item = answer_queue.get()
        answer_list[id] = item

    for item in answer_list:
        sys.stdout.write(item[0] + splitWord + item[1] + endRQS)

if __name__ == "__main__":
    main()
