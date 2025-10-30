from bs4 import BeautifulSoup
from lxml import html
import requests
import json
import re
import unicodedata
import pytz
import datetime
from datetime import date
from  pymongo import MongoClient
from bson import json_util
import os
import utils


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

def getHTMLPage(page):
  r = requests.get(page)
  if r.status_code != 200:
    exit
  soup = BeautifulSoup(r.content.decode("utf8"), 'lxml')
  return soup

def HBIH_scrapPageList(soup):
  logger = utils.setup_logger(None)

  table_articles = soup.find(id="main").find(class_="row").find_all(class_=["col-xs-12 col-sm-12 col-lg-4 col-md-12", "col-xs-12 col-sm-12 col-md-6 col-lg-4", "col-xs-12 col-sm-12 col-lg-8 col-md-12"])
  # print(table_articles)
  pageList = []
  # print(table_articles)
  # article_h2 = table_articles.find_all("h2")
  # article_h3 = table_articles.find_all("h3")
  for article in table_articles:
    # print("tag")
    # print(article)
    # print("article\n")
    article_json = {}
    for tag in article.find_all(['h2', 'h3']):
      # print(tag)
      try:
        article_json['articleName'] = tag.get_text()
        article_json['articleLink'] = tag.a.get('href')
        pageList.append(article_json)
      except Exception as error:
        logger.warning(error)
  # print(article_json)
  return pageList


def scrapReleases_HBIH_Missive(page_list, source):
  logger = utils.setup_logger(None)
  jsonRelease = {}
  releases_list = []

  for pageToScrap in page_list:
    try:
      pageLink = "https://www.heavyblogisheavy.com" + pageToScrap['articleLink']
      soup = getHTMLPage(pageLink)
      results = soup.find_all(isTitle_but_no_class)
      # print(results)
      for result in results:
        rePattern_ArtistReleaseGenres = r'^([^–-]+)\s*[–-]\s*([^(]+)\s*(?:\(([^)]+)\))?'
        artistReleaseGenres = re.match(rePattern_ArtistReleaseGenres, result.get_text())

        if artistReleaseGenres:
          artist = artistReleaseGenres.group(1).strip() if artistReleaseGenres.group(1) else ""
          releaseName = artistReleaseGenres.group(2).strip() if artistReleaseGenres.group(2) else ""
          genres = artistReleaseGenres.group(3).strip() if artistReleaseGenres.group(3) else ""

          if "," in genres:
            genres_list = genres.split(",")
          elif "/" in genres:
            genres_list = genres.split("/")
          else:
            genres_list = [genres]

          coverPath = ""
          try:
            allCoverPath = result.next_sibling.next_sibling.img.get('srcset').split()
            if len(allCoverPath) > 2:
              coverPath = allCoverPath[2]
            elif len(allCoverPath) > 0:
              coverPath = allCoverPath[0]
          except Exception as error:
            logger.error(' NO COVER FOUND : ' + str(error))
            pass

          jsonRelease = {'artistName': artist, 'albumName': releaseName, 'heavyBIsH': {'id': '', 'reviewLink': pageToScrap['articleLink'], 'releaseDate': {'month': utils.getMonth(), 'year': utils.getYear()}, 'imagePath': coverPath, 'genres': genres_list, 'sources': source}}
          releases_list.append(jsonRelease)
        else:
          logger.info(f"{result.get_text()}\n")
    except SyntaxError as syntax_error:
      logger.error(syntax_error)
    except AttributeError as attibute_error:
      logger.error(attibute_error)

  return releases_list

def isTitle_but_no_class(tag):
  """
  Release are located in h2 tags with no class
  """
  return (tag.name == "h2" or tag.name == "h3") and not tag.has_attr('class')
#print(releases_list)