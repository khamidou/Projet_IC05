#! /usr/bin/python
#
# this script build a gexf file based from a json file
# usage: convert input_file output_file
# 
import json
import sys
import os
from tweet import Tweet
from _gexf import Gexf, Graph


def extractJson(fileName):
    """ Extract tweets from JSON file into a list of Tweets """
    tweetList = list()
    try:
        file = open(fileName, encoding='utf-8')
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
            for mention in tweet['entities']['user_mentions']:
                nTweet.userMentions.append(mention["id"])
            tweetList.append(nTweet)
                
        file.close()

    except(ValueError):
        sys.exit("Error while parsing{0}".format(fileName) + "Not a valid JSON file")

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

def createGexfNodes(tweetList):
    """ Creates the Nodes from the given list of Tweets """
    gexf = Gexf("Ronan Kervella / Karim Hamidou","Graph for USA 2012 Presidential elections")
    graph = gexf.addGraph("directed","static","Graph for USA 2012 Presidential elections")
    createAttributes(graph)
    graphIndex = 0
    for tweet in tweetList:
        graph.addNode(graphIndex,tweet.userName)
        graph.nodes[str(graphIndex)].addAttribute(str(1),str(tweet.userId))
        graph.nodes[str(graphIndex)].addAttribute(str(2),tweet.userName)
        graph.nodes[str(graphIndex)].addAttribute(str(3),tweet.date)
        graph.nodes[str(graphIndex)].addAttribute(str(4),tweet.text)
        graph.nodes[str(graphIndex)].addAttribute(str(5),tweet.profileImgUrlHttp)
        graph.nodes[str(graphIndex)].addAttribute(str(6),tweet.source)

        graphIndex += 1

    return gexf

def createGexfEdges(gexf, tweetList):
    """ Creates the Edges for the given Graph """
    edgeIndex = 0
    for node in gexf.graphs[0].nodes.values():
        for tweet in tweetList:
            for uid in tweet.userMentions:
                if (str(tweet.userId) != node.attributes[0]['value']):
                    if (node.attributes[0]['value'] == str(uid)):
                        source = node
                        target = findNodeFromUid(gexf,uid)
                        gexf.graphs[0].addEdge(edgeIndex,source,target)
                        edgeIndex += 1

def createAttributes(graph):
    graph.addNodeAttribute("userId",None,"integer","static",str(1))
    graph.addNodeAttribute("userName",None,"string","static",str(2))
    graph.addNodeAttribute("date",None,"string","static",str(3))
    graph.addNodeAttribute("textMsg",None,"string","static",str(4))
    graph.addNodeAttribute("profile_image_url",None,"string","static",str(5))
    graph.addNodeAttribute("source",None,"string","static",str(6))
    return graph

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



inFile = sys.argv[1]
outFile = sys.argv[2]

tlist = list()
# if the input file is a directory, parse each file from it
if (os.path.isdir(inFile)):
        jsonFiles = os.listdir(inFile)
        print("Parsing files from "+inFile+"/ ...")
        for file in jsonFiles:
            tmpList = (extractJson(inFile + "/" + file))
            if (len(tlist) > 0):
                tmpList = clearDuplicates(tlist, tmpList)
            tlist.extend(tmpList)
else:
    tlist = extractJson(inFile)

print("{0} tweets parsed".format(len(tlist)))
gexfCreated = createGexfNodes(tlist)
createGexfEdges(gexfCreated, tlist)
outputFile = open(outFile+".gexf","w")
gexfCreated.write(outputFile)
