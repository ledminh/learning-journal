// index.tsx

export namespace index {
  function getJournalEntries() {
    // Get 5 journal entries
    // DEFAULT VALUES:
    // limit: 5
    // offset: 0
    // filters: null
    // sortBy: date
    // sortOrder: desc
  }

  function getTags() {
    // Last 10 tags
  }

  function getDates() {
    // dates in the last 2 months
    // count of journal entries for each date
  }
}

export namespace tags {
  function getTags() {
    // All tags.
    // No Journal Entries.
  }
}

export namespace tag {
  function getTag() {
    // Tag with journal entries
    // DEFAULT VALUES:
    // limit: 5
    // offset: 0
    // filters: null
    // sortBy: date
    // sortOrder: desc
  }
}

export namespace dates {
  function getDates() {
    // Last 10 dates with journal entries
  }
}
