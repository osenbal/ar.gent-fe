import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftEditorCommand,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  ContentBlock,
  ContentState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button, styled } from '@mui/material';
import { stateToHTML } from 'draft-js-export-html';

const TEXT_EDITOR_ITEM = 'draft-js-example-item';

interface BlockComponentProps {
  contentState: ContentState;
  block: ContentBlock;
}

const Image = (props: BlockComponentProps) => {
  const { block, contentState } = props;
  const { src } = contentState.getEntity(block.getEntityAt(0)).getData();
  return <img src={src} alt={src} role="presentation" />;
};

const Media = (props: BlockComponentProps) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const type = entity.getType();

  let media = null;
  if (type === 'image') {
    media = <Image {...props} />;
  }

  return media;
};

const mediaBlockRenderer = (block: ContentBlock) => {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
};

export const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a rel="noopener noreferrer" target="_blank" href={url}>
      {props.children}
    </a>
  );
};

const linkDecorator = new CompositeDecorator([
  {
    strategy: (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      }, callback);
    },
    component: Link,
  },
]);

const TextEditor: React.FC = () => {
  const data = localStorage.getItem(TEXT_EDITOR_ITEM);
  const initialState = data
    ? EditorState.createWithContent(
        convertFromRaw(JSON.parse(data)),
        linkDecorator
      )
    : EditorState.createEmpty(linkDecorator);
  const [editorState, setEditorState] =
    React.useState<EditorState>(initialState);

  const handleSave = () => {
    const data = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    localStorage.setItem(TEXT_EDITOR_ITEM, data);
  };

  const handleAddLink = () => {
    const selection = editorState.getSelection();
    const link = prompt('Please enter the URL of your link');
    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
      return;
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', {
      url: link,
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      'apply-entity'
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
  };

  const handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleTogggleClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleBlockClick = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const EditorText = styled(Editor)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    '& .public-DraftEditorPlaceholder-root': {
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
      '&:first-letter': {
        textTransform: 'uppercase',
      },
    },
    '& .public-DraftEditor-content': {
      ...theme.typography.body2,
      '& h1': {
        ...theme.typography.h4,
      },
      '& h2': {
        ...theme.typography.h5,
      },
      '& h3': {
        ...theme.typography.h6,
      },
      '& h4': {
        ...theme.typography.subtitle1,
      },
      '& h5': {
        ...theme.typography.subtitle2,
      },
      '& h6': {
        ...theme.typography.overline,
      },
      '& a': {
        color: theme.palette.text.primary,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      '& img': {
        maxWidth: '100%',
        display: 'block',
        margin: '0 auto',
      },
    },
  }));

  console.log(stateToHTML(editorState.getCurrentContent()));
  return (
    <div className="texteditor">
      <Button onMouseDown={(e) => handleBlockClick(e, 'header-three')}>
        H3
      </Button>
      <Button onMouseDown={(e) => handleBlockClick(e, 'unstyled')}>
        Normal
      </Button>
      <Button onMouseDown={(e) => handleTogggleClick(e, 'BOLD')}>bold</Button>
      <Button onMouseDown={(e) => handleTogggleClick(e, 'UNDERLINE')}>
        underline
      </Button>
      <Button onMouseDown={(e) => handleTogggleClick(e, 'ITALIC')}>
        italic
      </Button>
      <Button onMouseDown={(e) => handleTogggleClick(e, 'STRIKETHROUGH')}>
        strikthrough
      </Button>
      <Button onMouseDown={(e) => handleBlockClick(e, 'ordered-list-item')}>
        Ordered List
      </Button>
      <Button onMouseDown={(e) => handleBlockClick(e, 'unordered-list-item')}>
        Unordered List
      </Button>

      <Button
        disabled={editorState.getSelection().isCollapsed()}
        onMouseDown={(e) => {
          e.preventDefault();
          handleAddLink();
        }}
      >
        link
      </Button>
      <Button
        disabled={editorState.getUndoStack().size <= 0}
        onMouseDown={() => setEditorState(EditorState.undo(editorState))}
      >
        Undo
      </Button>
      <Button
        disabled={editorState.getRedoStack().size <= 0}
        onMouseDown={() => setEditorState(EditorState.redo(editorState))}
      >
        Redo
      </Button>
      <EditorText
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        blockRendererFn={mediaBlockRenderer}
        placeholder="Description of the job"
      />
    </div>
  );
};

export default TextEditor;
