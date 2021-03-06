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

r = requests.get("http://www.heavyblogisheavy.com/category/reviews/")
if r.status_code != 200:
	exit

# r.encoding = 'iso-8859-1'
#print(r.text)
# with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
soup = BeautifulSoup(r.content.decode("utf8"), 'lxml')

releases_list = []

#Je recupere le tableau des release du mois en cours
table_articles = soup.find(id="main").find_all("article")

for article in table_articles:
  # print("BEGINNING OF RELEASE ==========")
  #print(article)
  try:
    artist_and_release = article.find(class_="cb-post-title").a.string
    print(artist_and_release)
    #Séparation de la chaine en 2 parties. Si pas 2 parties exactement alors problème
    stringSplit = artist_and_release.split(" – ", 1)
    #print(stringSplit)
  except AttributeError as attrib_error:
    print(attrib_error)
  except TypeError as type_error:
    print("Type Error " + type_error)
    # print("not an album: " + artist_and_release)
  else:
  #extraction du nom de l'artiste et de la release : "ARTISTE - NOM RELEASE"
    if len(stringSplit) == 2:
      # print (artist_and_release)
      reviewLink = article.div.a.get('href')

      #Récupération de l'id du post
      idRelease=article.get('id').split('-')[1]
      #print("idRelease: "+ idRelease)
      artist = stringSplit[0]
      album = stringSplit[1]
      # print("ARTIST " + artist)
      #Récupération de la date du post. Servira en tant que Date de Release
      releaseDate = article.find(class_="cb-date cb-byline-element").time.string
      print(releaseDate)

      # print(article.header.next_sibling.next_sibling.next_sibling.next_sibling.a.img.get('srcset'))
      try:
        # print(article.find(class_="ut-postThumbnail-Link").img)

        img_tab = article.find(class_="cb-mask").a.img.get('srcset').split()
        #img_tab = article.header.next_sibling.next_sibling.next_sibling.next_sibling.a.img.get('srcset').split()
      except AttributeError as error:
        print(error)
        print("Album's cover not found. Artist: " + artist)
        #print(article.find(class_="cb-mask").a.img.get('srcset'))
      else:
        if len(img_tab) > 2:
          img = img_tab[2]
        else:
          img = img_tab[0]

        #print(img)
        releaseJson = {'artistName':artist, 'albumName':album,'heavyBIsH':{'id':idRelease, 'reviewLink': reviewLink, 'releaseDate':{ 'month': int(monthDic[releaseDate.split()[0]]), 'year': int(releaseDate.split()[2])}, 'imagePath': img}}
        releases_list.append(releaseJson)
      finally:
        pass

  # print("END OF RELEASE ===========")

#print(releases_list)

with open('heavyB_data.json', 'w', encoding='iso-8859-1') as f:
  json.dump(releases_list, f, indent=4, ensure_ascii=True)
f.close()


##### UPSERT IN DB - COLLECTION :ALBUMS
#connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))

db = connection.get_default_database()
releases = db.albums
albums = open("heavyB_data.json", "r")
parsedAlbums = json_util.loads(albums.read())
timezone = pytz.timezone("Europe/Paris")
today = date.today()
t_day = today.day
t_month = today.month
t_year = today.year

for album in parsedAlbums:
  # print("PRINT ALBUM ", album["heavyBIsH"]["id"])
  #album['created'] = str(datetime.today().isoformat())
  #result = releases.update_one({'heavyBIsH.id': album['heavyBIsH']['id'] }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now())}}, upsert=True)
  result = releases.update_one({'artistName': {'$regex': '^'+re.escape(album['artistName'])+'$', '$options': 'i'}, 'albumName': {'$regex': '^'+re.escape(album['albumName'])+'$',  '$options': 'i'} }, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now()), 'sortDate': {'day': t_day, 'month':t_month, 'year': t_year}}}, upsert=True)

connection.close()
