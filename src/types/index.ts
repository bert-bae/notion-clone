export type EditableContentBlock = {
  id: string;
  tag: string;
  html: string;
  ref?: any;
};

export enum ElementTagTitles {
  PageTitle = "PageTitle",
  Heading = "Heading",
  Subheading = "Subheading",
  Paragraph = "Paragraph",
  CodeBlock = "CodeBlock",
}

export enum ElementTagTypes {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  p = "p",
  code = "code",
}

export type ElementTag = {
  id: ElementTagTitles;
  tag: ElementTagTypes;
  label: string;
};
