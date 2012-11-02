#!/usr/bin/env python
#
# this script get the results of the twitter api for the KEYWORDS in 
# the list "KEYWORDS".
# the results are then saved in a timestamped file.
#
# usage: scrapper output_dir

KEYWORDS = ["romney", "obama", "gary johnson", "ryan", "ron paul"]
DURATION = 120 # in seconds

import os
import sys
import json
import urllib, urllib2
import datetime
from time import sleep

def timeStamped(fname, fmt='{fname}%Y-%m-%d-%H-%M-%S.json'):
        return datetime.datetime.now().strftime(fmt).format(fname=fname)

def getPage(url):
    req = urllib2.Request(url)
    response = urllib2.urlopen(req)
    return response.read()

def runQuery():
    queryString = ""
    for keyword in KEYWORDS:
        if keyword != KEYWORDS[-1]:
            queryString += keyword + " OR "
        else:
            queryString += keyword
    url = "http://search.twitter.com/search.json?q=%s&include_entities=1" % queryString
    url = url.replace(" ", "%20")
    with open(timeStamped("search_"), 'w') as outf:
        outf.write(getPage(url))

os.chdir(sys.argv[1])

while True:
    print "Querying..."
    runQuery()
    sleep(DURATION)
