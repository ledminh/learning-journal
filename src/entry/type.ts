/************************
 * Data
 */

enum MaterialType {
  Link = "link",
  Quote = "quote",
  Code = "code",
  Image = "image",
}

type Entry = {
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
type GetEntryFunction = (slug: string) => Entry;
type GetEntriesFunction = (options: {
  filters?: {
    materialType?: MaterialType;
    keyword?: string;
    tag?: string;
    date?: string;
  };
  sort?: {
    by?: "date" | "title";
    order?: "asc" | "desc";
  };
}) => Entry[];
