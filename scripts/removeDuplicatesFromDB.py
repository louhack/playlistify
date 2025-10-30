
import utils
def main() -> None:
    client = utils.connect_to_database()
    db = client['heroku_j6lv18qq']
    releases = db.albums
    utils.remove_duplicates(releases)


if __name__ == "__main__":
    main()
