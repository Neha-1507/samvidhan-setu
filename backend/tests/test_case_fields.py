from app.corpus import load_cases, load_corpus


def test_cases_have_issue_and_provisions_fields():
    for c in load_cases():
        assert c["legal_issue_en"] and c["legal_issue_hi"], c["id"]
        assert isinstance(c["provisions"], list), c["id"]
        assert c["bench_size"] is None or (isinstance(c["bench_size"], int) and c["bench_size"] >= 2), c["id"]


def test_case_provisions_exist_in_the_database():
    refs = {d["ref"] for d in load_corpus() if d["kind"] != "case"}
    for c in load_cases():
        for p in c["provisions"]:
            assert p in refs, f"{c['id']} links to unknown provision: {p}"
