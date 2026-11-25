from app.analyzer import analyze
from app.corpus import load_corpus

C = load_corpus()


def refs(text, mention):
    item = next(m for m in analyze(text, C)["mentions"] if m["mention"] == mention)
    return [x["ref"] for x in item["matches"]]


def test_old_crpc_482_is_not_confused_with_new_bnss_482():
    assert refs("Petition under Section 482 CrPC", "CrPC 482") == ["BNSS Section 528"]
    assert refs("Application under Section 482 BNSS", "BNSS 482") == ["BNSS Section 482"]


def test_women_safety_sections_map_from_ipc():
    assert refs("Sections 354D and 509 IPC", "IPC 354D") == ["BNS Section 78"]
    assert refs("Sections 354D and 509 IPC", "IPC 509") == ["BNS Section 79"]


def test_every_section_has_a_unique_old_reference():
    from app.analyzer import parse_replaces
    seen = {}
    for d in C:
        if d["kind"] == "act":
            for key in parse_replaces(d["replaces"]):
                assert key not in seen, f"{key} claimed by {seen[key]} and {d['ref']}"
                seen[key] = d["ref"]
