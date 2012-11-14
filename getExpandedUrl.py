import json
import sys
import urllib


def resolveFile(fileName):
    inFile = open(fileName)
    jsonStr = inFile.read()
    file = json.loads(jsonStr)
    result = dict()

    for tweet in file['results']:
        urlStr = ""
        expandedUrl = ""
        if ('urls' in tweet['entities']):
            for urls in tweet['entities']['urls']:
                urlStr = urls['url']
                expandedUrl = urls['expanded_url']
                try:
                    u = urllib.urlopen(expandedUrl)
                except IOError:
                    continue
                result[urlStr] =  [expandedUrl, u.url]
    return result

dic = dict()
#print sys.argv
for i, file in enumerate(sys.argv[2:]):
    dic.update(resolveFile(file))
    if i % 10  == 0:
        print "dump"
        json.dump(dic, open(sys.argv[1],"w+"))
json.dump(dic, open(sys.argv[1],"w+"))


