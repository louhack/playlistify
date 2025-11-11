# ...existing code...
import os
import re
import json
import time
import logging
from pathlib import Path
from requests.exceptions import RequestException, SSLError
from typing import List, Optional, Dict, Any
import utils
import requests
from bs4 import BeautifulSoup
from bson import json_util
import datetime as dt
from pymongo import MongoClient
from pytz import timezone


# --- Configuration ---
OUTPUT_FILE = Path("./scripts/output/SputnikData.json")
MONGO_ENV = "MONGODB_WEBSCRAPPER"
SPUTNIK_URL = "http://www.sputnikmusic.com/newreleases.php"
# LOGFILE = f"log_{dt.datetime.now().strftime("%Y-%m-%d")}.log"

monthDic = {
    "January": 1, "February": 2, "March": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "August": 8,
    "September": 9, "October": 10, "November": 11, "December": 12
}

# --- Logging ---
today = dt.datetime.now().strftime("%Y-%m-%d")
log_file = f"./scripts/logs/log_{today}.log"
logger = utils.setup_logger(log_file,console=False)


def _get_number_of_user_ratings(album_url: str, session: requests.Session) -> str:
    """Visit album page and extract number of user ratings. Returns '0' on failure."""
    try:
        r = session.get(album_url)
        r.raise_for_status()
    except (RequestException, SSLError) as e:
        logger.debug("Failed fetching album page %s: %s", album_url, e)
        return "0"

    soup = BeautifulSoup(r.content.decode("UTF-8", "ignore"), "lxml")
    ratingElt = soup.find(class_="reviewtabs_selected")
    if ratingElt:
        m = re.search(r"(\d+)", ratingElt.get_text())
        if m:
            return m.group(1)
    # fallback: try to find 'user ratings' text
    try:
        node = soup.find(string=re.compile(r"user ratings", re.I))
        if node:
            parent_text = node.parent.parent.parent.get_text()
            m = re.search(r"(\d+)", parent_text)
            if m:
                return m.group(1)
    except Exception:
        logger.debug("Couldn't parse number of user ratings for %s", album_url)
    return "0"


def _parse_release_cell(cell, releaseDate: List[str], session: requests.Session) -> Optional[Dict[str, Any]]:
    """Parse one release cell and return release dict or None."""
    try:
        note = cell.span.string
        album_link = cell.find("a").get("href")
        if not album_link:
            return None
        album_page = "https://www.sputnikmusic.com" + album_link
        nbOfRating = _get_number_of_user_ratings(album_page, session)
        # artist and album name come from the sibling td text nodes
        strings = list(cell.td.next_sibling.stripped_strings)
        if len(strings) < 2:
            return None
        artist, album = strings[0], strings[1]
        album_id = album_link[7:13]
        imagePath = f"https://www.sputnikmusic.com/images/albums/{album_id}.jpg"
        release_json = {
            "artistName": artist,
            "albumName": album,
            "sputnikMusic": {
                "id": album_id,
                "note": float(note) if note else 0.0,
                "releaseDate": {"month": int(monthDic.get(releaseDate[0], 0)), "year": int(releaseDate[1])},
                "imagePath": imagePath,
                "numberOfUserRatings": nbOfRating
            }
        }
        return release_json
    except Exception as e:
        logger.debug("Failed to parse release cell: %s", e)
        return None


def parse_data(content: bytes) -> List[Dict[str, Any]]:
    session = utils.make_requests_session()
    soup = BeautifulSoup(content.decode("UTF-8", "ignore"), "lxml")

    # Find the visible month header
    currentmonth_node = soup.find(class_="plaincontentbox")
    if not currentmonth_node:
        logger.error("Could not find plaincontentbox in page")
        return []

    # attempt several traversal paths safely
    try:
        currentmonth = currentmonth_node.tr.td.table.tr.td.string
    except Exception:
        try:
            currentmonth = currentmonth_node.table.td.string
        except Exception:
            currentmonth = None

    table_releases = soup.find_all(class_="alt1")
    releases_list: List[Dict[str, Any]] = []
    first = True
    for table in table_releases:
        if first and currentmonth:
            releaseDate = currentmonth.split()
            first = False
        else:
            # previous sibling traversal
            try:
                mois_lu = table.parent.parent.previous_sibling.td.string
                releaseDate = mois_lu.split()
            except Exception:
                logger.debug("Failed to get releaseDate for a table; skipping")
                continue

        for release in table:
            cell1 = release
            parsed = _parse_release_cell(cell1, releaseDate, session)
            if parsed:
                releases_list.append(parsed)

            # second column
            try:
                release2 = release.td.next_sibling.next_sibling
            except Exception:
                release2 = None

            if release2 is not None:
                parsed2 = _parse_release_cell(release2, releaseDate, session)
                if parsed2:
                    releases_list.append(parsed2)

    logger.info("Parsed %d releases", len(releases_list))
    return releases_list


def write_to_file(data: List[Dict[str, Any]], filename: Path):
    utils.write_json_file(filename, data, encoding="iso-8859-1")


def connect_to_db() -> MongoClient:
    return utils.connect_to_db(MONGO_ENV)


def main():
    skip_scrape = (
        "--skip-scrape" in os.sys.argv
        or os.getenv("SKIP_SCRAPE", "false").lower() in ("1", "true", "yes")
    )
    logger.info("Script started")
    if not skip_scrape:
        content = utils.fetch_url(SPUTNIK_URL)
        if content is None:
            logger.error("Failed to fetch data; exiting")
            return
        data = parse_data(content)
        write_to_file(data, OUTPUT_FILE)
        logger.info("Wrote %d releases to %s", len(data), OUTPUT_FILE)
    else:
        logger.info("Skipping fetch; loading existing file")
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

    try:
        with connect_to_db() as connection:
            utils.update_db(connection, data)
            logger.info("Database update finished")
    except Exception as e:
        logger.error("Database update failed: %s", e)

    logger.info("Script finished")
    time.sleep(1)


if __name__ == "__main__":
    main()
# ...existing code...