import React from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "@material-ui/core/Box";
import EditableBlock from "./editable-block";
import { setCaretToEnd } from "./carat-helper";
import { EditableContentBlock, ElementTagTypes } from "../../types";
export type EditablePageProps = {
  blocks: EditableContentBlock[];
};

const createDefaultBlocks = (): EditableContentBlock[] => {
  return [
    {
      id: uuidv4(),
      html: "Notion Clone",
      tag: ElementTagTypes.h1,
    },
    {
      id: uuidv4(),
      html: "This is a simple Notion text-editor clone",
      tag: ElementTagTypes.h3,
    },
    {
      id: uuidv4(),
      html:
        "Press Enter to create new blocks. To change the type of available blocks, type '/' to trigger the menu to select the type from.",
      tag: ElementTagTypes.p,
    },
    {
      id: uuidv4(),
      html: `
      const codeBlock = () => {<br>
        &nbsp;&nbsp;console.log('It even supports code blocks')<br>
      }
      `,
      tag: ElementTagTypes.code,
    },
  ];
};

const createBlankBlock = (): EditableContentBlock => {
  const id = uuidv4();
  return { id, html: "", tag: "p" };
};

const EditablePage: React.FC<EditablePageProps> = (props) => {
  const [blocks, setBlocks] = React.useState<EditableContentBlock[]>(
    props.blocks.length === 0 ? createDefaultBlocks() : props.blocks
  );
  const [
    blockInFocus,
    setBlockInFocus,
  ] = React.useState<EditableContentBlock>();

  const handleUpdatePageBlock = (updatedBlock: EditableContentBlock) => {
    const updatedBlocks = [...blocks];
    const index = updatedBlocks.findIndex((x) => x.id === updatedBlock.id);
    updatedBlocks[index] = updatedBlock;
    setBlocks(updatedBlocks);
  };

  const handleAddPageBlock = (
    currentBlock: Pick<EditableContentBlock, "id" | "ref">
  ) => {
    const newBlock = createBlankBlock();
    const updatedBlocks = [...blocks];
    const index = updatedBlocks.findIndex((x) => x.id === currentBlock.id);
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
    setBlockInFocus(newBlock);
  };

  const handleDeletePageBlock = (
    currentBlock: Pick<EditableContentBlock, "id" | "ref">
  ) => {
    const index = blocks.findIndex((b) => b.id === currentBlock.id);
    if (index > 0) {
      const updatedBlocks = [...blocks];
      const index = updatedBlocks.findIndex((x) => x.id === currentBlock.id);
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      setBlockInFocus(blocks[index - 1]);
    }
  };

  React.useEffect(() => {
    if (blockInFocus) {
      document.getElementById(blockInFocus.id)?.focus();
      setCaretToEnd(blockInFocus.id);
    }
  }, [blockInFocus]);

  return (
    <Box>
      {blocks.map((block, i) => (
        <EditableBlock
          key={i}
          id={block.id}
          tag={block.tag}
          html={block.html}
          addBlock={handleAddPageBlock}
          deleteBlock={handleDeletePageBlock}
          updateBlock={handleUpdatePageBlock}
        />
      ))}
    </Box>
  );
};

export default EditablePage;
