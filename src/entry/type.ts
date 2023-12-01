/************************
 * Data
 */

enum MaterialType {
  Link = "link",
  Quote = "quote",
  Code = "code",
  Image = "image",
}

type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  material: {
    type: MaterialType;
    content: string;
  };
  content: string;
};

/***********************
 * Functions
 */
type GetJournalEntryFunction = (slug: string) => JournalEntry;
type GetJournalEntriesByTagFunction = (
  tag: string,
  options: {
    filters?: {
      date?: string;
      materialType?: MaterialType;
      keyword?: string;
    };
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  }
) => JournalEntry[];

type GetJournalEntriesByDateFunction = (
  date: string,
  options: {
    filters?: {
      tag?: string;
      materialType?: MaterialType;
      keyword?: string;
    };
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  }
) => JournalEntry[];
