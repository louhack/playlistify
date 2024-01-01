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
  table_articles = soup.find(id="main").find_all("article")
  pageList = []
  # print(table_articles)
  for article in table_articles:
    # print("article")
    # print(article)
    # print("article\n")
    article_json = {}
    try:
      article_json['articleName'] = article.find(class_="cb-post-title").a.string
      article_json['articleLink'] = article.find(class_="cb-post-title").a.get('href')
      pageList.append(article_json)
    except Exception as error:
      print(error)
    # print(articles_list)
  return pageList


def scrapReleases_HBIH_Missive(page_list, source):
  jsonRelease = {}
  releases_list = []

  for pageToScrap in page_list:
    try:
      pageLink = pageToScrap['articleLink']
      soup = getHTMLPage(pageLink)
      results = soup(isTitle_but_no_class)
      # print(results)
      # print(pageToScrap['articleName'])
      for result in results:
        # different patterns /
        # rePattern_ArtistReleaseGenres = r'(^[^-]*[^ -]) – ([^ -][^-]*) \(([^)]+)\)'
        # rePattern_ArtistReleaseGenres = r'(^[^-]*[^ -]) *– *([^(]*) +\(([^)]+)\)'

        # this pattern works nicely. Expected pattern : <ArtistName> - < AblumNane> (Genre 1, ..., Genre n)
        print(result.get_text())
        # rePattern_ArtistReleaseGenres = r'(^.*[^ -]) *– *([^- ].*[^ (]) *\(([^)]+)\)'
        rePattern_ArtistReleaseGenres = r'(^.*[^ -]) *– *([^- ].*)'
        artistReleaseGenres = re.findall(rePattern_ArtistReleaseGenres, unicodedata.normalize('NFKD', (result.get_text())))
        # print(artistReleaseGenres)

        if len(artistReleaseGenres) == 1 and len(artistReleaseGenres[0]) == 2:
          rePattern_ReleaseGenres = r'(.*[^ (]) *\(([^)]+)\)'
          releaseGenres = re.findall(rePattern_ReleaseGenres, unicodedata.normalize('NFKD', artistReleaseGenres[0][1]))
          # print(releaseGenres)
        # (^.*[^ -]) *– *([^- ].*)   -> group1 = artistName // group2 = albumName (Genres)
        # (.*[^ (]) *\(([^)]+)\)  Decoup qlbumName et Genres
        # search the release based on the regex pattern
        # if len(artistReleaseGenres) == 1 and len(artistReleaseGenres[0]) == 3:
            #Regex has matched a release. I save the information
          artist = str.strip(artistReleaseGenres[0][0])
          if len(releaseGenres) > 0:
            releaseName = str.strip(releaseGenres[0][0])
            genres = str.split(releaseGenres[0][1], ",")
            genresClean = []
            for genre in genres:
              genresClean.append(str.strip(genre))
            # print(releaseName)
            # print(genresClean)
          else:
            genresClean=[]
            releaseName = str.strip(artistReleaseGenres[0][1])
            # print(releaseName)

          # print("GENRES : " + str(genresClean))
          # I need to find the path for the cover
          coverPath = ""
          try:
            allCoverPath = result.next_sibling.next_sibling.img.get('srcset').split()
            # if several cover path are existing, I save the 2nd one - lower resolution
            if len(allCoverPath) > 2:
              coverPath = allCoverPath[2]
            elif len(allCoverPath) > 0:
              coverPath = allCoverPath[0]

          except Exception as error:
            print(error)
            pass

          jsonRelease = {'artistName':artist, 'albumName':releaseName,'heavyBIsH':{'id':'', 'reviewLink': pageToScrap['articleLink'], 'releaseDate':{ 'month': getMonth(), 'year': getYear()}, 'imagePath': coverPath, 'genres': genresClean, 'sources': source}}
          # print(jsonRelease)
          releases_list.append(jsonRelease)

        # else:
          # print("No album detected : " + str(artistReleaseGenres))

    except SyntaxError as syntax_error:
      print(syntax_error)
    except AttributeError as attibute_error:
      print(attibute_error)


  return releases_list

def isTitle_but_no_class(tag):
  """
  Release are located in h2 tags with no class
  """
  return (tag.name == "h2" or tag.name == "h3") and not tag.has_attr('class')
#print(releases_list)

def getTodaysDay():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.day

def getMonth():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.month

def getYear():
  # timezone = pytz.timezone("Europe/Paris")
  today = date.today()
  return today.year


# SAVE DATA TO FILE
def saveToFile(fileName, dataToSave):
  with open(fileName, 'w', encoding='iso-8859-1') as f:
    json.dump(dataToSave, f, indent=4, ensure_ascii=True)
  f.close()


##### UPSERT IN DB - COLLECTION :ALBUMS
def saveToDabase(fileName):
  # connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
  #connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))

  #db = connection.get_default_database()
  print("Connecting to db")
  print(os.environ.get('MONGODB_WEBSCRAPPER'))
  connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))
  print(connection)
  #connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")

  db = connection['heroku_j6lv18qq']
  releases = db.albums
  albums = open(fileName, "r")
  parsedAlbums = json_util.loads(albums.read())
  timezone = pytz.timezone("Europe/Paris")
# today = date.today()
# t_day = today.day
# t_month = today.month
# t_year = today.year

  for album in parsedAlbums:
    # print("PRINT ALBUM ", album["heavyBIsH"]["id"])
    #album['created'] = str(datetime.today().isoformat())
    #result = releases.update_one({'heavyBIsH.id': album['heavyBIsH']['id'] }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now())}}, upsert=True)
    result = releases.update_one({'artistName': {'$regex': '^'+re.escape(album['artistName'])+'$', '$options': 'i'}, 'albumName': {'$regex': '^'+re.escape(album['albumName'])+'$',  '$options': 'i'} }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now()), 'sortDate': {'day': getTodaysDay(), 'month':getMonth(), 'year': getYear()}}}, upsert=True)

    # print(str(result))

  connection.close()
