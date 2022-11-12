import { v4 as uuidv4 } from "uuid";
import tinymce, {Editor} from "tinymce";

export type HTMLNoteElement = {
  container: HTMLDivElement,
  actionBar: HTMLDivElement,
  content: HTMLDivElement
}

class Note {
  readonly id: string;
  private _content: string;
  private _isFavorite: boolean;
  private _HTMLNote: HTMLNoteElement;
  public editor: Editor;

  public get content(): string {
    return this._content;
  }

  public set content(content: string) {
    this._content = content;
  }

  public get isFavorite(): boolean {
    return this._isFavorite;
  }

  public toggleFavorite() {
    this._isFavorite = !this._isFavorite;
  }

  public get HTMLNote(): HTMLNoteElement {
    return this._HTMLNote;
  }

  public constructor(id?: string, content?: string, isFavorite?: boolean) {
    this.id = id ?? uuidv4();
    this._content = content ?? "";
    this._isFavorite = isFavorite ?? false;
  }

  private textChangeHandler(event: Event) {
    const { name, value } = event.target as HTMLTextAreaElement;
    if (name === "content") {
      this._content = value;
    }
  }

  private removeNote() {
    this.HTMLNote.container.parentNode.removeChild(this.HTMLNote.container);
  }

  private dragNote = (event: MouseEvent) => {
    const { movementX, movementY } = event;
    const containerStyle: CSSStyleDeclaration = window.getComputedStyle(this._HTMLNote.container);
    const { left, top } = { left: parseFloat(containerStyle.left), top: parseFloat(containerStyle.top) };
    // const exceedsWidth = left + movementX > window.innerWidth - parseFloat(containerStyle.width) || left + movementX < 0;
    // const exceedsHeight = top + movementY > window.innerHeight - parseFloat(containerStyle.height) || top + movementY < 0;
    this._HTMLNote.container.style.left = `${left + movementX}px`;
    this._HTMLNote.container.style.top = `${top + movementY}px`;
  }

  private grabNote() {
    window.addEventListener("mousemove", this.dragNote);
  }

  private dropNote() {
    window.removeEventListener("mousemove", this.dragNote);
  }

  private createNoteBar(): HTMLDivElement {
    const noteBar = document.createElement('div');
    noteBar.classList.add("note-bar");
    const deleteButton: HTMLDivElement = document.createElement("div");
    deleteButton.classList.add("note-bar-delete");
    deleteButton.addEventListener("click", this.removeNote.bind(this));
    const deleteButtonIcon: HTMLImageElement = document.createElement('img');
    deleteButtonIcon.classList.add('note-bar-delete-icon')
    deleteButtonIcon.src = "images/cross-sign.png";
    deleteButtonIcon.alt = "remove";
    deleteButton.appendChild(deleteButtonIcon);
    noteBar.appendChild(deleteButton);
    noteBar.addEventListener("mousedown", this.grabNote.bind(this));
    window.addEventListener("mouseup", this.dropNote.bind(this));
    return noteBar;
  }

  private createActionButton(name: string, text: string, onClick: { (): void; (): void; (this: HTMLImageElement, ev: MouseEvent): any; }): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('tinymce-action-button');
    button.classList.add(`tinymce-action-button-${name}`);
    button.innerText = text;
    button.addEventListener('click', onClick);
    return button;
  }

  private prepareForTinyMCE(noteContent: HTMLDivElement) {
    tinymce.activeEditor.setContent(noteContent.innerHTML);

    const boardContainer: HTMLDivElement = document.querySelector('.stck-brd');
    boardContainer.style.pointerEvents = 'none';

    const actionButtons = document.createElement('div');
    actionButtons.classList.add('tinymce-action-buttons');

    const closeButton = this.createActionButton('close', 'Close', () => {
      boardContainer.style.pointerEvents = 'auto';
      tinymce.activeEditor.setContent('');
      tinymce.activeEditor.destroy();
    });

    const saveButton = this.createActionButton('save', 'Save', () => {
      boardContainer.style.pointerEvents = 'auto';
      noteContent.innerHTML = tinymce.activeEditor.getContent();
      tinymce.activeEditor.focus();
    });

    actionButtons.appendChild(closeButton);
    actionButtons.appendChild(saveButton);

    const actionButtonsContainer: HTMLDivElement = document.querySelector('.tox-statusbar__branding');
    actionButtonsContainer.innerHTML = '';
    actionButtonsContainer.appendChild(actionButtons);
  }

  private createNoteSeparator(): HTMLHRElement {
    const noteSeparator = document.createElement('hr');
    noteSeparator.classList.add('note-separator');
    return noteSeparator;
  }

  private createNoteContent(): HTMLDivElement {
    const noteContent = document.createElement('div');
    noteContent.classList.add("note-content");
    noteContent.classList.add(this.id);
    noteContent.id = this.id;
    noteContent.addEventListener("change", this.textChangeHandler.bind(this));
    noteContent.addEventListener('click', () => {
      tinymce.init({
        selector: '.tinymce-placeholder',
        custom_ui_selector: '.save-button'
      }).then(() => {
        this.prepareForTinyMCE(noteContent);
      });
    });
    return noteContent;
  }

  public createElement(): HTMLNoteElement {
    const newHTMLNote: HTMLDivElement = document.createElement("div");
    newHTMLNote.classList.add("note");
    
    const { noteBar, noteSeparator, noteContent } = {
      noteBar: this.createNoteBar(),
      noteSeparator: this.createNoteSeparator(),
      noteContent: this.createNoteContent()
    }

    newHTMLNote.appendChild(noteBar);
    newHTMLNote.appendChild(noteSeparator);
    newHTMLNote.appendChild(noteContent);
    
    this._HTMLNote = {
      container: newHTMLNote,
      actionBar: noteBar,
      content: noteContent
    }
    
    return this.HTMLNote;
  }
}

export default Note;
