import React from "react";
import { matchSorter } from "match-sorter";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { ElementTag, ElementTagTypes, ElementTagTitles } from "../../types";

const elementTags: ElementTag[] = [
  {
    id: ElementTagTitles.PageTitle,
    tag: ElementTagTypes.h1,
    label: "Title",
  },
  {
    id: ElementTagTitles.Heading,
    tag: ElementTagTypes.h2,
    label: "Header",
  },
  {
    id: ElementTagTitles.Subheading,
    tag: ElementTagTypes.h3,
    label: "Subheader",
  },
  {
    id: ElementTagTitles.Paragraph,
    tag: ElementTagTypes.p,
    label: "Paragraph",
  },
  {
    id: ElementTagTitles.CodeBlock,
    tag: ElementTagTypes.code,
    label: "Code block",
  },
];

export type SelectMenuProps = {
  onSelect(tag: ElementTagTypes): void;
  onClose(): void;
};

const useStyles = makeStyles((props: SelectMenuProps) => ({
  menu: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "3px",
    padding: "0 auto",
    backgroundColor: "white",
    borderRadius: "5px",
    border: "1px solid lightgrey",
    width: "150px",
  },
  menuItem: {
    padding: "5px",
    "&:hover": {
      color: "white",
      backgroundColor: "lightgrey",
      cursor: "pointer",
    },
  },
}));

const SelectMenu: React.FC<SelectMenuProps> = (props) => {
  const { onSelect, onClose } = props;
  const [command, setCommand] = React.useState<string>("");
  const [items, setItems] = React.useState<ElementTag[]>(elementTags);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState<number>(0);
  const classes = useStyles(props);

  const handleKeyDown = (e: KeyboardEvent): void => {
    console.log(e.key);
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        onSelect(items[selectedItemIndex]?.tag);
        break;
      case "Escape":
      case "Backspace":
        if (!command) {
          onClose();
        }
        setCommand(command.substring(0, command.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedItemIndex((prev) =>
          prev === 0 ? items.length - 1 : prev - 1
        );
        break;
      case "ArrowDown":
      case "Tab":
        e.preventDefault();
        setSelectedItemIndex((prev) =>
          prev === items.length - 1 ? 0 : prev + 1
        );
        break;
      default:
        setCommand((prev) => prev + e.key);
        break;
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIndex, items]);

  React.useEffect(() => {
    const items = matchSorter(elementTags, command, { keys: ["tag"] });
    setItems(items);
  }, [command]);

  const menuItems = items.map((item, key) => {
    const selected = selectedItemIndex;
    const isSelected = items.indexOf(item) === selected;
    return (
      <Box
        className={classes.menuItem}
        style={
          isSelected ? { color: "white", backgroundColor: "lightgrey" } : {}
        }
        key={key}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(item.tag)}
      >
        {item.label}
      </Box>
    );
  });
  return <Box className={classes.menu}>{menuItems}</Box>;
};

export default SelectMenu;
