#! /usr/bin/python
#
# usage: convert input_file output_file
# 
import json
import sys
import os
import urllib
from tweet import Tweet


def extractTweets(fileName):
    """ Extract tweets from JSON file into a list of Tweets """
    tweetList = list()
    try:
        file = open(fileName)
        json_str = file.read()
        data = json.loads(json_str)

        for tweet in data['results']:
            nTweet = Tweet()
            nTweet.id = tweet['id']
            nTweet.userId = tweet['from_user_id']
            nTweet.text = tweet['text']
            nTweet.user = tweet['from_user']
            nTweet.userName = tweet['from_user_name']
            nTweet.profileImgUrlHttp = tweet['profile_image_url']
            nTweet.source = tweet['source']
            nTweet.toUser = tweet['to_user']
            nTweet.date = tweet['created_at']

            if ('urls' in tweet['entities']):
                for urls in tweet['entities']['urls']:
                  urlStr = urls['url']
                  expandedUrl = urls['expanded_url']
                  try:
                      u = urllib.urlopen(expandedUrl)
                  except (IOError):
                      continue
                  nTweet.urls = [expandedUrl, u.url]
                  print(nTweet.urls)

            for mention in tweet['entities']['user_mentions']:
                nTweet.userMentions.append({"id":mention["id"],"name":mention["name"], "screenName":mention["screen_name"]})
            tweetList.append(nTweet)
        file.close()

    except(ValueError):
        sys.exit("Error while parsing {0}".format(fileName) + " Not a valid JSON file")

    return tweetList

def printTweets(tweetList):
    """ Print tweets from tweetList on stdout """

    for tweet in tweetList:
        print("-------------------\n")
        print("From : {0} ID : {1}".format(tweet.userName,tweet.userId))
        print("Msg : "+tweet.text+"\n")
        for mention in tweet.userMentions:
            print("Mentioned User ID : {0}".format(mention))
        print("There are {0} tweets".format(len(tweetList)))

def findNodeFromUid(gexf,uid):
    """ Returns the Node corresponding to the userId of a tweet """
    for node in gexf.graphs[0].nodes.values():
        if (str(node.attributes[0]['value']) == str(uid)):
            return node

def clearDuplicates(tweetList, tmpList):
    """ Returns a list without duplicate entries """
    temp = tmpList
    for tweet in tweetList:
        for t in tmpList:
            if (t.id == tweet.id):
                temp.remove(t)
    return temp

def writeJson(tweetList, outputFile):
    nodeList = list()
    edgesList = list()

    for tweet in tweetList:
        if tweet.userName not in nodeList:
            nodeList.append(tweet.userName)
        for url in tweet.urls:
            if url[1] not in nodeList:
                nodeList.append(url[1])
    
    #dic = {"nodes":[],"edges":[]}
    #nodeIndex = 0
    #for tweet in tweetList:
    #    dic["nodes"].append({"user_mentions":[], "user_name":tweet.userName})
    #    for mention in tweet.userMentions:
    #        dic["nodes"][nodeIndex]["user_mentions"].append(mention["name"])
    #    nodeIndex += 1
    #json.dump(dic, open(outputFile,"w"))

inFile = sys.argv[1]
outFile = sys.argv[2]

tlist = list()
# if the input file is a directory, parse each file from it
if (os.path.isdir(inFile)):
        jsonFiles = os.listdir(inFile)
        print("Parsing files from "+inFile+"/ ...")
        for file in jsonFiles:
            tmpList = (extractTweets(inFile + "/" + file))
            if (len(tlist) > 0):
                tmpList = clearDuplicates(tlist, tmpList)
            tlist.extend(tmpList)
else:
    tlist = extractTweets(inFile)

print("{0} tweets parsed".format(len(tlist)))
writeJson(tlist, outFile)