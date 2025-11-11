import datetime as dt
import sys
import utils
import wepScrapperFunctions as ws  # was: from wepScrapperFunctions import *
import utils as ws_utils

EDITORSPICK = "https://www.heavyblogisheavy.com/tag/editors-picks/"
# JAZZCLUB    = "https://www.heavyblogisheavy.com/tag/the-jazz-club/"
DOOMSDAY    = "https://www.heavyblogisheavy.com/tag/doomsday/"
POSTROCK    = "https://www.heavyblogisheavy.com/tag/post-rock-post/"
KULT        = "https://www.heavyblogisheavy.com/tag/kvlt-kolvmn/"
# UNMETAL     = "https://www.heavyblogisheavy.com/tag/unmetal-monthly/"
LISTENTOTHIS= "https://www.heavyblogisheavy.com/tag/listen-to-this/"
ROTTEN      = "https://www.heavyblogisheavy.com/tag/rotten-to-the-core/"

PAGES = [
    ("EDITORSPICK", EDITORSPICK, "Editor's pick"),
    # ("JAZZCLUB",    JAZZCLUB,    "Jazz Club"),
    ("DOOMSDAY",    DOOMSDAY,    "Doomsday"),
    ("POSTROCK",    POSTROCK,    "Post-Rock"),
    ("KULT",        KULT,        "KULT"),
    # ("UNMETAL",     UNMETAL,     "Unmetal"),
    ("LISTENTOTHIS",LISTENTOTHIS,"Listen to this"),
    ("ROTTEN",      ROTTEN,      "Rotten to the core"),
]

# --- Logging ---
today = dt.datetime.now().strftime("%Y-%m-%d")
log_file = f"./scripts/logs/log_{today}.log"
logger = utils.setup_logger(log_file,console=False)

MONGO_ENV = "MONGODB_WEBSCRAPPER"

def main() -> None:
    
    # optional arg to run a single page by key, e.g. EDITORSPICK
    arg = sys.argv[1] if len(sys.argv) > 1 else None

    # today = dt.datetime.now().strftime("%Y-%m-%d")
    # log_file = f"log_{today}.log"
    # logger = utils.setup_logger(log_file)

    pages = [p for p in PAGES if (arg is None or p[0] == arg)]
    if not pages:
        print(f"Unknown argument: {arg}")
        sys.exit(1)

    last_file = None
    for suffix, page_url, source in pages:
            logger.info(f"Starting with {page_url}")
            soup = ws.getHTMLPage(page_url,logger)

            page_list = ws.HBIH_scrapPageList(soup,logger)
            logger.info(f"Page list size: {len(page_list)}")

            releases_list = ws.scrapReleases_HBIH_Missive(page_list, source,logger)

            file_name = f'./scripts/output/heavyB_data_{suffix}.json'
            logger.info(f"Saving to file {file_name}")
            utils.saveToFile(file_name, releases_list)
            last_file = file_name

    try:
        with utils.connect_to_db(MONGO_ENV) as connection:
            utils.update_db(connection, releases_list)
            logger.info("Database update finished")
    except Exception as e:
        logger.error("Database update failed: %s", e)

if __name__ == "__main__":
    main()
