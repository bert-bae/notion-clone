import React from "react";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import SelectMenu from "./select-menu";
import { setCaretToEnd } from "./carat-helper";
import { EditableContentBlock, ElementTagTypes } from "../../types";

export type EditableBlockProps = {
  id: string;
  html: string;
  tag: string;
  addBlock(block: Pick<EditableContentBlock, "id" | "ref">): void;
  deleteBlock(block: Pick<EditableContentBlock, "id" | "ref">): void;
  updateBlock(block: EditableContentBlock): void;
};

const useStyles = makeStyles((theme: Theme) => ({
  block: {
    cursor: "pointer",
    display: "block",
    padding: theme.spacing(1),
    margin: "3px 0",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      background: "#F5F5F5",
      outlineColor: "#F5F5F5",
    },
    "&:focus": {
      background: "#E8E8E8",
      outlineColor: "#E8E8E8",
    },
  },
  codeBlock: {
    background: "#4A4A4A",
    outlineColor: "#4A4A4A",
    color: "white",
    "&:hover": {
      background: "#3F3F3F",
      outlineColor: "#3F3F3F",
    },
    "&:focus": {
      background: "#333333",
      outlineColor: "#333333",
    },
  },
}));

const whiteSpace = "&nbsp;";

const EditableBlock: React.FC<EditableBlockProps> = (props) => {
  const { addBlock, deleteBlock, updateBlock } = props;
  const classes = useStyles();
  const [htmlBackup, setHtmlBackup] = React.useState<string>("");
  const [html, setHtml] = React.useState<string>(props.html);
  const [tag, setTag] = React.useState<string>(props.tag);
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

  const contentEditable = React.createRef<any>();

  const handleContentChange = (e: ContentEditableEvent) => {
    setHtml(e.target.value);
  };

  const handleSelectMenuOpen = () => {
    setIsMenuOpen(true);
    document.addEventListener("click", () => handleSelectMenuClose(false));
  };

  const handleSelectMenuClose = (clearCmd?: boolean) => {
    if (clearCmd) {
      setHtml(htmlBackup);
      setHtmlBackup("");
    }
    setIsMenuOpen(false);
  };

  const handleTagSelection = (tag: ElementTagTypes) => {
    if (tag) {
      setTag(tag);
    }
    setCaretToEnd(props.id);
    handleSelectMenuClose(true);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "/") {
      handleSelectMenuOpen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "/") {
      setHtmlBackup(html);
    }

    if (!e.shiftKey && !isMenuOpen && e.key === "Enter") {
      e.preventDefault();
      addBlock({
        id: props.id,
        ref: contentEditable.current,
      });
    }

    if (e.key === "Backspace" && !html) {
      e.preventDefault();
      deleteBlock({
        id: props.id,
        ref: contentEditable.current,
      });
    }

    if (e.key === "Tab") {
      e.preventDefault();
      setHtml((prev) => {
        // Adding spaces in `code` html tag with no prior whitespace creates unwanted new <br>
        // Remove unwanted <br> at end of prev if it exists
        const removeLastNewLine = prev.replace(/\<br\/?\>$/, "");
        return `${removeLastNewLine}${whiteSpace + whiteSpace}`;
      });
    }
  };

  React.useEffect(() => {
    updateBlock({
      id: props.id,
      html,
      tag,
    });
  }, [html, tag]);

  return (
    <Box style={{ position: "relative" }} spellCheck={tag === "code"}>
      <ContentEditable
        id={props.id}
        className={clsx(classes.block, tag === "code" && classes.codeBlock)}
        innerRef={contentEditable}
        html={html}
        tagName={tag}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
      {isMenuOpen && (
        <SelectMenu
          onSelect={handleTagSelection}
          onClose={handleSelectMenuClose}
        />
      )}
    </Box>
  );
};

export default EditableBlock;
