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

EDITORSPICK = "https://www.heavyblogisheavy.com/category/columns/editors-picks/"

try:
  pageList = []


  soup=getHTMLPage(EDITORSPICK)

  # TODO retrieve page list
  # TODO for each page
  # get page
  # scrap page and add release to JSON object
  # Add release to db

  # print("Table articles ")
  # print(table_articles)
  pageList = HBIH_scrapPageList(soup)
  # print(pageList)
  releasesList = scrapReleases_HBIH_Missive(pageList)
  # print(releasesList)

  saveToFile('heavyB_data2.json', releasesList)

  saveToDabase('heavyB_data2.json')

except RuntimeError as runtime_error:
  print("runtime error")
  # print(runtime_error)
except AttributeError as attribute_error:
  print("attribute error")
  # print(attribute_error)
