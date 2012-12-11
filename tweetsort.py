#! /usr/bin/env python2
import sys
import json
from datetime import *

def extract_edges(inputFile):
    try:
        f = open(inputFile)
        json_str = f.read()
        data = json.loads(json_str)

        nodeList = list()
        edgeList = list()

        for node in data["nodes"]:
            nodeList.append(node)
        for edge  in data["edges"]:
            edgeList.append(edge)

    except IOError:
        print("Error opening {}.".format(inputFile))

    return nodeList,edgeList

def export(nlist,elist,out):
    dictweets = dict()
    dictweets= {"nodes":nlist, "edges":elist}
    json.dump(dictweets,open(out,"w"))

iFile = sys.argv[1]
oFile = sys.argv[2]
nlist,elist = extract_edges(iFile)
elist.sort(key=lambda r: r["date"])
export(nlist,elist,oFile)
print("Done !")

 
