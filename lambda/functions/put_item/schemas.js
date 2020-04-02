module.exports = {
  "tables": ["form", "question"],
  "schemas": {
    "form": {

    }
  },
  "references": {
    "form": {
      "questions": {
        "cardinality" : "many",
        "references" : "question",
      }
    }
  }
}
