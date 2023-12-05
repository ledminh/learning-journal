export enum MaterialType {
  Link = "MaterialType/link",
  Quote = "MaterialType/quote",
  Code = "MaterialType/code",
  Image = "MaterialType/image",
}

export type Material = {
  type: MaterialType;
  content: string;
};
