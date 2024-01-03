import os
import re
import time
from datetime import date, datetime
import json
from pymongo import MongoClient
from bson import json_util
from pytz import timezone
from bs4 import BeautifulSoup
import requests


def get_page_content(url):
    r = requests.get(url)
    if r.status_code != 200:
        print("Error while getting the page")
        exit
    return BeautifulSoup(r.content.decode("utf8"), 'lxml')

def get_reviews(soup):
    return soup.find_all("div",class_="post")

def get_artist_and_release(review):
    try:
        return review.find("h2").string
    except AttributeError:
        return review.find("h3").string

def get_review_link(review):
    try:
        return review.find("h2").a.get('href')
    except AttributeError:
        return review.find("h3").a.get('href')

def get_release_details(review_link):
    match = re.search(r'/(\d{4})/(\d{2})/\d{2}/([^/]*)', review_link)
    if match:
        return match.group(1), match.group(2), match.group(3)
    return None, None, None

def get_image_tab(review):
    try:
        div_tag = review.find('div', class_='background')
        return review.get('data-src')
    except AttributeError:
        return None

def connect_to_db():
    print("Connecting to db")
    connection = MongoClient(os.environ.get('MONGODB_WEBSCRAPPER'))
    print(connection)
    return connection

def get_current_date():
    tz = timezone("Europe/Paris")
    today = date.today()
    now = datetime.now(tz)
    return today.day, today.month, today.year, now

def update_releases(releases, parsed_albums, t_day, t_month, t_year, now):
    for album in parsed_albums:
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
    # Get the page content and reviews
    soup = get_page_content("http://www.heavyblogisheavy.com/category/reviews/")
    reviews = get_reviews(soup)

    releases_list = []
    for review in reviews:
        # Extract the necessary information from each review
        artist_and_release = get_artist_and_release(review)
        review_link = get_review_link(review)
        year, month, id_release = get_release_details(review_link)

        # Split the artist and release information
        string_split = artist_and_release.split(" - ")
        if len(string_split) == 2:
            artist = string_split[0]
            album = string_split[1]
            img_tab = get_image_tab(review)
            img = img_tab[2] if img_tab and len(img_tab) > 2 else img_tab[0]

            # Create a JSON object for the release and add it to the list
            release_json = {
                'artistName': artist,
                'albumName': album,
                'heavyBIsH': {
                    'id': id_release,
                    'reviewLink': review_link,
                    'releaseDate': { 'month': month, 'year': year },
                    'imagePath': img_tab
                }
            }
            releases_list.append(release_json)

    # print('length release list ', len(releases_list))
    # Write the list of releases to a JSON file
    with open('./scripts/heavyB_data.json', 'w', encoding='iso-8859-1') as f:
        json.dump(releases_list, f, indent=4, ensure_ascii=True)

    # Connect to the database and update the releases
    connection = connect_to_db()
    try:
        db = connection['heroku_j6lv18qq']
        releases = db.albums
        with open("./scripts/heavyB_data.json", "r") as albums:
            parsed_albums = json_util.loads(albums.read())
        t_day, t_month, t_year, now = get_current_date()
        # print(parsed_albums)
        update_releases(releases, parsed_albums, t_day, t_month, t_year, now)
    finally:
        connection.close()

    # Pause for 5 seconds
    time.sleep(5)

if __name__ == "__main__":
    main()