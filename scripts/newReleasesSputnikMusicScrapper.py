import os
import re
import json
import time
import sys
import requests
import dns
from bs4 import BeautifulSoup
from bson import json_util
from datetime import date, datetime
from pymongo import MongoClient
import certifi
from pytz import timezone

monthDic = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
}

def get_current_date():
    tz = timezone("Europe/Paris")
    today = date.today()
    now = datetime.now(tz)
    return today.day, today.month, today.year, now

def fetch_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None
    return response.content

def parse_data(content):
    # Your parsing logic here
    # r.encoding = 'iso-8859-1'
  #print(r.text)
  # with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
  soup = BeautifulSoup(content.decode("UTF-8", "ignore"), 'lxml')

  # print(soup)

  #Je recupere le 1er mois affiche sur la page qui correspondant au mois en cours
  #print(soup.find(class_="plaincontentbox").tr.next_sibling.td.string)
  #currentmonth = soup.find(class_="plaincontentbox").tr.next_sibling.td.string
  print(soup.find(class_="plaincontentbox").tr.td.table.tr.td.string)
  #print(soup.find(class_="plaincontentbox").tr)
  #currentmonth = soup.find(class_="plaincontentbox").table.td.string
  currentmonth = soup.find(class_="plaincontentbox").tr.td.table.tr.td.string

  #Je recupere le tableau des release du mois en cours
  table_releases = soup.find_all(class_="alt1")
  #print("table_releases")
  #print(table_releases)
  releases_list = []

  i=j=l=1

  for table in table_releases:
    if l==1:
      mois_lu=currentmonth
      releaseDate = mois_lu.split()
      l=2
    else:
      mois_lu = table.parent.parent.previous_sibling.td.string
      releaseDate = mois_lu.split()

    for release in table:
      note_release_1 = release.span.string
      album_link_1 = release.find("a").get('href')
      try:
        r2 = requests.get("https://www.sputnikmusic.com"+album_link_1)
      except ConnectionError as e:
        print("CONNETION ERROR")
        print (e)
        pass
      except TimeoutError as e:
        print("TIMEOUT ERROR")
        print(e)
        pass
      except requests.exceptions.SSLError as e:
        print("SSL ERROR")
        print(e)
        pass

      else:
        if r2.status_code != 200:
          exit
        soup2 = BeautifulSoup(r2.content.decode("UTF-8", "ignore"), 'lxml')
        # print(album_link_1)
        ratingElt = soup2.find(class_="reviewtabs_selected")
        # print("ratingelt ")
        # print(ratingElt)
        if ratingElt:
          nbOfRating = re.search(r'(\d+)', ratingElt.get_text()).group()
          # print("nbOfRqtinf" + nbOfRating)
        else:
          nbOfRating = re.search(r'(\d+)',soup2.find(string="user ratings").parent.parent.parent.get_text()).group()


      k=0
      for string in release.td.next_sibling.stripped_strings:
        if k==0:
          artiste_1=string
          k=1
        else:
          album_1=string
          k=0
          # print("Artiste ou Album", string)
      print("{} - {}".format(artiste_1, album_1))
      imagePath_1 = "https://www.sputnikmusic.com/images/albums/"+album_link_1[7:13]+".jpg"
      releaseJson = {'artistName':artiste_1, 'albumName':album_1,'sputnikMusic':{'id':album_link_1[7:13], 'note':float(note_release_1), 'releaseDate':{ 'month': int(monthDic[releaseDate[0]]), 'year': int(releaseDate[1])}, 'imagePath': imagePath_1, 'numberOfUserRatings': nbOfRating}}
      releases_list.append(releaseJson)
      j+=1


        #2nd release in the table (2nd column)
      release2 = release.td.next_sibling.next_sibling
        #Test the presence of a 2nd release in the 2nd column of the table
      if release2 != None:
          # print("============================ Album #", j, "============================")
          #print("je teste release 2:", release2)
        note_release_2 = release2.span.string

        album_link_2 = release2.next_sibling.find("a").get('href')
        try:
          r3 = requests.get("https://www.sputnikmusic.com"+album_link_2)
        except ConnectionError as e:
          print("CONNETION ERROR")
          print (e)
          pass
        except TimeoutError as e:
          print("TIMEOUT ERROR")
          print(e)
          pass
        else:
          if r3.status_code != 200:
            exit
          soup3 = BeautifulSoup(r3.content.decode("UTF-8", "ignore"), 'lxml')
          # print(album_link_1)
          ratingElt2 = soup3.find(class_="reviewtabs_selected")
          # print("ratingelt ")
          # print(ratingElt)
          if ratingElt2:
            nbOfRating2 = re.search(r'(\d+)', ratingElt2.get_text()).group()
            # print("nbOfRqtinf" + nbOfRating)
          else:
            nbOfRating2 = re.search(r'(\d+)',soup3.find(string="user ratings").parent.parent.parent.get_text()).group()

        k=0
        for string in release2.next_sibling.stripped_strings:
          if k==0:
            artiste_2=string
            k=1
          else:
            album_2=string
            k=0

        print("{} - {}".format(artiste_2, album_2))
        imagePath_2 = "https://www.sputnikmusic.com/images/albums/"+album_link_2[7:13]+".jpg"
        releaseJson2 = {'artistName':artiste_2, 'albumName':album_2,'sputnikMusic':{'id':album_link_2[7:13], 'note':float(note_release_2), 'releaseDate':{ 'month': int(monthDic[releaseDate[0]]), 'year': int(releaseDate[1])}, 'imagePath': imagePath_2, 'numberOfUserRatings': nbOfRating2}}
        releases_list.append(releaseJson2)
          #releases_list.append({'idAlbumSputnik':album_link_2[7:13],'artistName':artiste_2, 'albumName':album_2, 'note':note_release_2, 'releaseMonth':mois_lu, 'imagePath':imagePath_2})
        j+=1
      i+=1
  return releases_list

def write_to_file(data, filename):
    with open(filename, 'w', encoding='iso-8859-1') as f:
        json.dump(data, f, indent=4, ensure_ascii=True)

def connect_to_db():
    connection_string = os.environ.get('MONGODB_WEBSCRAPPER')
    return MongoClient(connection_string,
                      tls=True,                 # or ssl=True is fine, but tls is preferred
                      tlsCAFile=certifi.where(),
                      serverSelectionTimeoutMS=30000,)

def update_db(connection, data):
    db = connection['heroku_j6lv18qq']
    releases = db.albums
    t_day, t_month, t_year, now = get_current_date()

    for album in data:
        result = releases.update_one(
            {
                'artistName': {'$regex': '^'+re.escape(album['artistName'])+'$', '$options': 'i'}, 
                'albumName': {'$regex': '^'+re.escape(album['albumName'])+'$',  '$options': 'i'} 
            }, 
            {
                '$set': album, 
                '$currentDate': { 'lastModified': True }, 
                '$setOnInsert': {
                    'created': now, 
                    'sortDate': {'day': t_day, 'month':t_month, 'year': t_year}
                }
            }, 
            upsert=True
        )

def main():
    skip_scrape = (
        "--skip-scrape" in sys.argv
        or os.getenv("SKIP_SCRAPE", "false").lower() in ("1", "true", "yes")
    )

    if not skip_scrape:
        url = "http://www.sputnikmusic.com/newreleases.php"
        content = fetch_data(url)
        if content is None:
            return

        data = parse_data(content)
        write_to_file(data, "./scripts/data.json")
        print("album added to json file")
    else:
        print("Skipping fetch and parse steps")
        # load existing file
        with open("./scripts/data.json", "r", encoding="utf-8") as f:
            import json
            data = json.load(f)

    with connect_to_db() as connection:
        update_db(connection, data)
    print("script finished")
    time.sleep(5)

if __name__ == "__main__":
    main()

# def get_current_date():
#     tz = timezone("Europe/Paris")
#     today = date.today()
#     now = datetime.now(tz)
#     return today.day, today.month, today.year, now


# def main():
#   print("WebScrapping Sputnik Music")
#   try:
#     r = requests.get("http://www.sputnikmusic.com/newreleases.php")
#   except ConnectionError as e:
#     print(e)
#     exit

#   if r.status_code != 200:
#     exit

#   # r.encoding = 'iso-8859-1'
#   #print(r.text)
#   # with open("""..\\SputnikMusic\\New Releases _ Sputnikmusic.html""") as fp:
#   soup = BeautifulSoup(r.content.decode("UTF-8", "ignore"), 'lxml')

#   #print(soup)

#   #Je recupere le 1er mois affiche sur la page qui correspondant au mois en cours
#   #print(soup.find(class_="plaincontentbox").tr.next_sibling.td.string)
#   #currentmonth = soup.find(class_="plaincontentbox").tr.next_sibling.td.string
#   #print(soup.find(class_="plaincontentbox").tr.next_sibling.td.string)
#   currentmonth = soup.find(class_="plaincontentbox").table.td.string
#   #currentmonth = soup.find(class_="plaincontentbox").tr.next_sibling.td.string

#   #Je recupere le tableau des release du mois en cours
#   table_releases = soup.find_all(class_="alt1")

#   releases_list = []

#   i=j=l=1

#   for table in table_releases:
#     if l==1:
#       mois_lu=currentmonth
#       releaseDate = mois_lu.split()
#       l=2
#     else:
#       mois_lu = table.parent.parent.previous_sibling.td.string
#       releaseDate = mois_lu.split()

#     for release in table:
#       note_release_1 = release.span.string
#       album_link_1 = release.find("a").get('href')
#       try:
#         r2 = requests.get("https://www.sputnikmusic.com"+album_link_1)
#       except ConnectionError as e:
#         print("CONNETION ERROR")
#         print (e)
#         pass
#       except TimeoutError as e:
#         print("TIMEOUT ERROR")
#         print(e)
#         pass

#       else:
#         if r2.status_code != 200:
#           exit
#         soup2 = BeautifulSoup(r2.content.decode("UTF-8", "ignore"), 'lxml')
#         # print(album_link_1)
#         ratingElt = soup2.find(class_="reviewtabs_selected")
#         # print("ratingelt ")
#         # print(ratingElt)
#         if ratingElt:
#           nbOfRating = re.search(r'(\d+)', ratingElt.get_text()).group()
#           # print("nbOfRqtinf" + nbOfRating)
#         else:
#           nbOfRating = re.search(r'(\d+)',soup2.find(string="user ratings").parent.parent.parent.get_text()).group()


#       k=0
#       for string in release.td.next_sibling.stripped_strings:
#         if k==0:
#           artiste_1=string
#           k=1
#         else:
#           album_1=string
#           k=0
#           # print("Artiste ou Album", string)
#       # print("{} - {}".format(artiste_1, album_1))
#       imagePath_1 = "https://www.sputnikmusic.com/images/albums/"+album_link_1[7:13]+".jpg"
#       releaseJson = {'artistName':artiste_1, 'albumName':album_1,'sputnikMusic':{'id':album_link_1[7:13], 'note':float(note_release_1), 'releaseDate':{ 'month': int(monthDic[releaseDate[0]]), 'year': int(releaseDate[1])}, 'imagePath': imagePath_1, 'numberOfUserRatings': nbOfRating}}
#       releases_list.append(releaseJson)
#       j+=1


#         #2nd release in the table (2nd column)
#       release2 = release.td.next_sibling.next_sibling
#         #Test the presence of a 2nd release in the 2nd column of the table
#       if release2 != None:
#           # print("============================ Album #", j, "============================")
#           #print("je teste release 2:", release2)
#         note_release_2 = release2.span.string

#         album_link_2 = release2.next_sibling.find("a").get('href')
#         try:
#           r3 = requests.get("https://www.sputnikmusic.com"+album_link_2)
#         except ConnectionError as e:
#           print("CONNETION ERROR")
#           print (e)
#           pass
#         except TimeoutError as e:
#           print("TIMEOUT ERROR")
#           print(e)
#           pass
#         else:
#           if r3.status_code != 200:
#             exit
#           soup3 = BeautifulSoup(r3.content.decode("UTF-8", "ignore"), 'lxml')
#           # print(album_link_1)
#           ratingElt2 = soup3.find(class_="reviewtabs_selected")
#           # print("ratingelt ")
#           # print(ratingElt)
#           if ratingElt2:
#             nbOfRating2 = re.search(r'(\d+)', ratingElt2.get_text()).group()
#             # print("nbOfRqtinf" + nbOfRating)
#           else:
#             nbOfRating2 = re.search(r'(\d+)',soup3.find(string="user ratings").parent.parent.parent.get_text()).group()

#         k=0
#         for string in release2.next_sibling.stripped_strings:
#           if k==0:
#             artiste_2=string
#             k=1
#           else:
#             album_2=string
#             k=0

#         # print("{} - {}".format(artiste_2, album_2))
#         imagePath_2 = "https://www.sputnikmusic.com/images/albums/"+album_link_2[7:13]+".jpg"
#         releaseJson2 = {'artistName':artiste_2, 'albumName':album_2,'sputnikMusic':{'id':album_link_2[7:13], 'note':float(note_release_2), 'releaseDate':{ 'month': int(monthDic[releaseDate[0]]), 'year': int(releaseDate[1])}, 'imagePath': imagePath_2, 'numberOfUserRatings': nbOfRating2}}
#         releases_list.append(releaseJson2)
#           #releases_list.append({'idAlbumSputnik':album_link_2[7:13],'artistName':artiste_2, 'albumName':album_2, 'note':note_release_2, 'releaseMonth':mois_lu, 'imagePath':imagePath_2})
#         j+=1
#       i+=1

#   # print(releases_list)
#   # f.close()
#   print ("i %d, j %d, l %d", i,j,l)
#   print("Preparing writing output file")
#   with open('./scripts/data.json', 'w', encoding='iso-8859-1') as f:
#     json.dump(releases_list, f, indent=4, ensure_ascii=True)
#   f.close()
#   print("Output file written")

#   ##### UPSERT IN DB - COLLECTION :ALBUMS
#   # connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")
#   #mongodb://heroku_j6lv18qq:k7100p7qnmkdo5kk7i9io0q6ap@ds243418.mlab.com:43418/heroku_j6lv18qq
#   # NOK connection = MongoClient("mongodb://heroku_j6lv18qq:k7100p7qnmkdo5kk7i9io0q6ap@ds243418.mlab.com:43418/heroku_j6lv18qq?authSource=admin")
#   # mongodb://<dbuser>:<dbpassword>@ds243418.mlab.com:43418/heroku_j6lv18qq
#   print("Connecting to db")
#   print(os.environ.get('MONGODB_WEBSCRAPPER'))
#   connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))
#   print(connection)
#   #connection = MongoClient("mongodb://127.0.0.1:27017/playlistifyApp")

#   db = connection['heroku_j6lv18qq']
#   print(db)
#   releases = db.albums
#   albums = open("./scripts/data.json", "r")
#   parsedAlbums = json_util.loads(albums.read())

#   t_day, t_month, t_year, now = get_current_date()

#   print("inserting to db")
#   for album in parsedAlbums:
#     # print("PRINT ALBUM ", album["sputnikMusic"]["id"])
#     # album['lastModified'] = str(datetime.today().isoformat())
#     # result = releases.update_one({'artistName': album['artistName'], 'albumName': album['albumName']}, {'$set': album, '$currentDate': { 'lastModified': True }, '$setOnInsert': {'created': timezone.localize(datetime.datetime.now()), 'sortDate': {'day': t_day, 'month':t_month, 'year': t_year}}}, upsert=True)
#     result = releases.update_one(
#       {
#               'artistName': {'$regex': '^'+re.escape(album['artistName'])+'$', '$options': 'i'}, 
#               'albumName': {'$regex': '^'+re.escape(album['albumName'])+'$',  '$options': 'i'} 
#       }, 
#       {
#         '$set': album, 
#         '$currentDate': { 'lastModified': True }, 
#         '$setOnInsert': {
#             'created': now, 
#             'sortDate': {'day': t_day, 'month':t_month, 'year': t_year}
#         }
#       }, 
#       upsert=True)
    
#   print("data inserted")
#   connection.close()

#   time.sleep(5)

# if __name__ == "__main__":
#     main()