class Note {
  index: number;
  text: string;
  done: boolean;
}

const noteTemplate = document.querySelector(
  "#list-item"
) as HTMLTemplateElement;
const notesList = document.querySelector("main") as HTMLElement;
const form = document.querySelector("form");
const formText = document.querySelector("input") as HTMLInputElement;
const counter = document.getElementById("items-left");
const notes: Note[] = [];
let noteIndex: number = 0;
let editTextBox = document.createElement("input");



const note = noteTemplate.content.firstElementChild.cloneNode(
  true
) as HTMLElement;

form.onsubmit = (event) => {
  event.preventDefault();
  let noteText: string = formText.value;
  noteIndex++;
  let noteObject = new Note();
  noteObject.text = noteText;
  noteObject.done = false;
  noteObject.index = noteIndex;
  notes.push(noteObject);

  createNote(noteText, noteIndex);
  updateCounter();
};

function createNote(noteText: string, noteIndex: number) {
  const note = noteTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;

  note.querySelector("#todo").textContent = noteText;
  note.setAttribute("id", noteIndex.toString());

  const deleteButton = note.querySelector("button");
  deleteButton.onclick = (event) => {
    let toRemove = notes.findIndex(
      (i) => i.index == parseInt(note.getAttribute("id"))
    );
    notes.splice(toRemove, 1);
    note.remove();
    updateCounter();
  };

  notesList.append(note);
  formText.value = "";

  note.addEventListener("dblclick", editNote);
}

function editNote() {
  let noteText: string = formText.value;
  noteText = note.querySelector("#todo").textContent;
  note.replaceChildren();

  let editForm = document.createElement("form");
  editForm.setAttribute("class", "parent");
  let div = document.createElement("div");
  div.setAttribute("class", "left-frame");
  let spacerBox = document.createElement("input");
  spacerBox.setAttribute("type", "checkbox");
  spacerBox.setAttribute("id", "checkbox");
  spacerBox.setAttribute("style", "opacity: 0");
  editTextBox.setAttribute("type", "text");
  editTextBox.setAttribute("class", "note");
  editTextBox.value = noteText;
  note.appendChild(editForm);
  editForm.appendChild(div);
  div.appendChild(spacerBox);
  editForm.appendChild(editTextBox);
  editTextBox.focus();
  editForm.addEventListener("submit", restoreNote);
  editTextBox.addEventListener("blur", restoreNote);
}

function restoreNote() {
  const newNote = noteTemplate.content.firstElementChild.cloneNode(true) as HTMLElement;
  newNote.querySelector("#todo").textContent = editTextBox.value;

  const deleteButton = newNote.querySelector("button");
  deleteButton.onclick = (event) => {
    let toRemove = notes.findIndex(
      (i) => i.index == parseInt(note.getAttribute("id"))
    );
    notes.splice(toRemove, 1);
    newNote.remove();
    updateCounter();
  };
  editTextBox.removeEventListener("blur", restoreNote);

  note.replaceChildren(newNote);
  updateCounter();
}

function updateCounter() {
  let count = notes.length;
  if (count == 1) {
    counter.textContent = count + "item left";
  } else if (count == 0) {
    counter.textContent = "";
  } else {
    counter.textContent = count + "items left";
  }
}
