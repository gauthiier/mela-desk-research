#! /usr/bin/python
# http://bulba.sdsu.edu/jeanette/thesis/PennTags.html
# http://nltk.org/api/nltk.tag.html#module-nltk.tag

import sys
sys.path.append("/Library/Python/2.7/site-packages/")

import csv
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize

DATAFILE = "/Users/vorg/Workspace/ciid-mela/mela-desk-research/viz/cases-book/data/Field05.csv"
F_DESCRIPTION = 22

dataReader = csv.reader(open(DATAFILE))
lineNumber = 0
firstRow = None
for row in dataReader:
  lineNumber += 1
  if (lineNumber < 5) : continue #skip metadata rows
  description = row[F_DESCRIPTION]
  #print word_tokenize(description)
  print pos_tag(word_tokenize(description))