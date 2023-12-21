// ui

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
}

// admin cp

export namespace admin_index {
  function getJournalEntries() {
    // Get 10 journal entries
    // DEFAULT VALUES:
    // limit: 10
    // offset: 0
    // sortBy: date
    // sortOrder: desc
    // filters: null
  }
}

export namespace admin_add_new_journal {
  function addJournalEntry() {
    // Add a journal entry
  }
}

export namespace admin_edit_journal {
  function getJournalEntry() {
    // Get a journal entry
  }

  function updateJournalEntry() {
    // Update a journal entry
  }

  function deleteJournalEntry() {
    // Delete a journal entry
  }
}
