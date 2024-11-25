import genanki
import json
import os

with open("./templates.json") as file:
    templates_config = json.load(file)

with open("./release.json") as file:
    release_config = json.load(file)

BUILTIN_FIELDS = ["Tags", "Type", "Deck", "Subdeck", "CardFlag", "Card", "FrontSide"]


def gen_apkg(id: str, locale: str):
    print(f"generating {id} {locale}")
    folder = f"dist/{id}/{locale}"
    with open(f"{folder}/front.html") as f:
        front = f.read()
    with open(f"{folder}/back.html") as f:
        back = f.read()
    release = release_config[id]
    template = templates_config[id]
    fields = list(filter(lambda field: field not in BUILTIN_FIELDS, template["fields"]))
    model = genanki.Model(
        release_config[id]["id"][locale],
        f"IKKZ_{id}_TEMPLATE_{locale}".upper(),
        fields=list(map(lambda field: {"name": field}, fields)),
        templates=[{"name": "Card 1", "qfmt": front, "afmt": back}],
    )

    deck = genanki.Deck(
        deck_id=release["deck"], name=f"{template['name']} Template Demo"
    )
    for note_config in release_config[id]["notes"]:
        note = genanki.Note(
            model=model,
            fields=list(
                map(
                    lambda field: note_config["fields"][field]
                    if field in note_config["fields"]
                    else "",
                    fields,
                )
            ),
        )
        deck.add_note(note)

    genanki.Package(deck).write_to_file(
        f"release/{template['name']} Template-{locale}.apkg"
    )


os.makedirs("release", exist_ok=True)

for id in templates_config.keys():
    for locale in ["zh", "en"]:
        gen_apkg(id, locale)
