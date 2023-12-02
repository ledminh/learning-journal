/************************
 * Data
 */

enum MaterialType {
  Link = "link",
  Quote = "quote",
  Code = "code",
  Image = "image",
}

export type JournalEntry = {
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
export type GetJournalEntryFunction = (slug: string) => Promise<JournalEntry>;

export type GetJournalEntriesFunction = (options?: {
  limit?: number;
  offset?: number;
  filters?: {
    date?: string;
    materialType?: MaterialType;
    keyword?: string;
  };
  sort?: {
    by?: "date" | "title";
    order?: "asc" | "desc";
  };
}) => JournalEntry[];
