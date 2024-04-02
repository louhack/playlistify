from bs4 import BeautifulSoup
from lxml import html
import requests
import json
import re
from  pymongo import MongoClient
from bson import json_util
import datetime
import pytz
from datetime import date
import os
from wepScrapperFunctions import *
import sys


monthDic = {}
monthDic["January"]=1
monthDic["February"]=2
monthDic["March"]=3
monthDic["April"]=4
monthDic["May"]=5
monthDic["June"]=6
monthDic["July"]=7
monthDic["August"]=8
monthDic["September"]=9
monthDic["October"]=10
monthDic["November"]=11
monthDic["December"]=12

EDITORSPICK = "https://www.heavyblogisheavy.com/tag/editors-picks/"
JAZZCLUB = "https://www.heavyblogisheavy.com/category/columns/the-jazz-club/"
DOOMSDAY = "https://www.heavyblogisheavy.com/category/columns/doomsday/"
POSTROCK = "https://www.heavyblogisheavy.com/category/columns/post-rock-post/"
KULT = "https://www.heavyblogisheavy.com/category/columns/kvlt-kolvmn/"
UNMETAL = "https://www.heavyblogisheavy.com/category/columns/unmetal-monthly/"

def main() -> None:
  opts = [opt for opt in sys.argv[1:] if opt.startswith("-")]
  args = [arg for arg in sys.argv[1:] if not arg.startswith("-")]

  print(args)
  if args[0] == "EDITORSPICK":
    pageToScrap = EDITORSPICK
    source = "Editor's pick"
  elif args[0] =="JAZZCLUB":
    pageToScrap = JAZZCLUB
    source = "Jazz Club"
  elif args[0] =="DOOMSDAY":
    pageToScrap = DOOMSDAY
    source = "Doomsday"
  elif args[0] =="POSTROCK":
    pageToScrap = POSTROCK
    source = "Post-Rock"
  elif args[0] =="KULT":
    pageToScrap = KULT
    source = "KULT"
  elif args[0] =="UNMETAL":
    pageToScrap = UNMETAL
    source = "Unmetal"
  else:
    print("No Page to scrap argument")
    quit()

  try:
    pageList = []

    print(pageToScrap)
    soup=getHTMLPage(pageToScrap)

    # print("Table articles ")
    # print(table_articles)
    pageList = HBIH_scrapPageList(soup)
    print("Page List")
    print(pageList)
    releasesList = scrapReleases_HBIH_Missive(pageList, source)
    print("Releases List")
    print(releasesList)

    fileName = './scripts/'+'heavyB_data_'+str(args[0])+'.json'
    print(fileName)
    saveToFile(fileName, releasesList)

    saveToDabase(fileName)
  except RuntimeError as runtime_error:
    print(runtime_error)
  # print(runtime_error)
  except AttributeError as attribute_error:
    print(attribute_error)
  # print(attribute_error)

if __name__ == "__main__":
    main()
