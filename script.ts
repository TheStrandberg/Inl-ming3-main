class Note {
  id: number = 0;
  text: string = "";
  done: boolean = false;
} // index heter nu id

// Ändrat lite variabelnamn, behöver fortfarande städas
const noteTemplate = document.querySelector(
  "#list-item"
) as HTMLTemplateElement;
const notesList = document.querySelector("main")! as HTMLElement;
const form = document.querySelector("form")! as HTMLFormElement;
const formText = document.querySelector("input")! as HTMLInputElement;
const counter = document.getElementById("items-left")! as HTMLElement;
const notes: Note[] = [];
let noteIndex: number = 0;
let noteText: string = formText.value;
const asideStyle = document.querySelector("aside")! as HTMLElement;
const checkAllButton = document.querySelector("#button")! as HTMLButtonElement;
const clearCompletedButton = document.getElementById("clearallcompleted")! as HTMLButtonElement;

loadLocalStorage();
function loadLocalStorage() {
  // Ändrat här, så dubbletter kan läsas in
  if (localStorage.length > 0) {    
    for (let i = 0; i < localStorage.length; i++) {
      let textStart = localStorage.key(i)!.indexOf('$');
      noteText = localStorage.key(i)!.substring(textStart + 1);
      let noteDone: boolean = false;
      if (localStorage.getItem(localStorage.key(i)!) == "true") {
        noteDone = true;
      }

      let noteObject = new Note();
      noteObject.text = noteText;
      noteObject.done = noteDone;
      noteObject.id = noteIndex;
      notes.push(noteObject);

      createNote(noteObject);
      noteIndex++;
    }    
    updateCounter();
  }
};

form.onsubmit = (event) => {
  event.preventDefault();
  let noteText: string = formText.value;

  if (noteText === "") {
    //Do nothing
  } else {
    let noteObject = new Note();
    noteObject.text = noteText;
    noteObject.done = false;
    noteObject.id = noteIndex;
    notes.push(noteObject);

    asideStyle.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";

    createNote(noteObject);
    noteIndex++;
    updateCounter();
  }
};

// MASSA småändringar här, funktionen tar nu emot ett Note-objekt istället för 3 parametrar
function createNote(note: Note) {
  const noteNode = noteTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

  noteNode.querySelector("#todo")!.textContent = note.text;
  noteNode.setAttribute("id", note.id.toString());

  const deleteButton = noteNode.querySelector("button")!;
  deleteButton.onclick = (event) => {
    let toRemove = notes.findIndex(
      (i) => i.id == parseInt(noteNode.getAttribute("id")!)
    );
    notes.splice(toRemove, 1);
    noteNode.remove();
    updateCounter();
  };  

  const checkBox = noteNode.querySelector("#boxcheck")! as HTMLInputElement;
  if (note.done == true) {
    checkBox.checked = true;
  }
  checkBox.onclick = (event) => {
    let setDoneUndone = notes.findIndex(
      (i) => i.id == parseInt(noteNode.getAttribute("id")!)
    );
    if (checkBox.checked === true) {
      notes[setDoneUndone].done = true;
      clearCompletedButton.style.visibility = "visible";
    } else {
      notes[setDoneUndone].done = false;
    }
    updateCounter();
  };  
  
  notesList.append(noteNode);
  formText.value = "";
  formText.focus();

  noteNode.addEventListener("dblclick", editNote);
  function editNote() {
    noteText = note.text;
    noteIndex = note.id;
    noteNode.replaceChildren();

    let editForm = document.createElement("form");
    editForm.setAttribute("class", "parent");
    let div = document.createElement("div");
    div.setAttribute("class", "left-frame");

    let editTextBox = document.createElement("input") as HTMLInputElement;
    editTextBox.setAttribute("type", "text");
    editTextBox.setAttribute("class", "note");
    editTextBox.value = note.text;

    noteNode.appendChild(editForm);
    editForm.appendChild(div);
    editForm.appendChild(editTextBox);
    editTextBox.focus();
    editForm.addEventListener("submit", restoreNote);
    editTextBox.addEventListener("blur", restoreNote);

    function restoreNote() {
      const newNote = noteTemplate.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
      newNote.querySelector("#todo")!.textContent = editTextBox.value;
      newNote.setAttribute("id", noteIndex.toString());

      let noteToEdit = notes.findIndex((i) => i.id == noteIndex);
      notes[noteToEdit].text = editTextBox.value;
      notes[noteToEdit].done = false;

      // Some duplicate code for controls in here, did not seem to work well just looping back to createNote
      const deleteButton = newNote.querySelector("button")!;
      deleteButton.onclick = (event) => {
        let toRemove = notes.findIndex(
          (i) => i.id == note.id
        );
        notes.splice(toRemove, 1);
        newNote.remove();
        updateCounter();
      };

      const checkBox = newNote.querySelector("#boxcheck")! as HTMLInputElement;
      checkBox.onclick = (event) => {
        let setDoneUndone = notes.findIndex(
          (i) => i.id == note.id
        );
        if (checkBox.checked === true) {
          notes[setDoneUndone].done = true;
        } else {
          notes[setDoneUndone].done = false;
        }
        updateCounter();
      };

      editTextBox.removeEventListener("blur", restoreNote);

      noteNode.replaceChildren(newNote);
      updateCounter();
    }
  }
}

checkAllButton.addEventListener("click", trueCheckBoxes);
function trueCheckBoxes() {
  let checkedBox = <HTMLInputElement[]>(
    (<any>document.querySelectorAll("input[type=checkbox]"))
  );
  if (notes.length === 0) {
    // Do nothing
  } 
  else {
    let completed = 0;
    notes.forEach((element) => {
      if (element.done == true) {
        completed++;
      }
    });
    if (completed == notes.length) {
      checkedBox.forEach((checkbox) => {
        checkbox.checked = false;
      });
      notes.forEach((element) => {
        element.done = false;
      });
    } 
    else {
      checkedBox.forEach((checkbox) => {
        checkbox.checked = true;
      });
      notes.forEach((element) => {
        element.done = true;
      });
    }
  }
  updateCounter();
}

//Clear all "checked" notes
// Fick denna att fungera, var tvungen att skapa en kopia av listan och jämföra med, blev problem att iterera över samm lista som man tog bort objekt i. Fungerade inte heller att bara säga notesCopy = notes av ngn anledning.
clearCompletedButton.onclick = (event) => {
  let notesCopy: Note[] = [];
  notes.forEach((element) => {
    notesCopy.push(element);
  })
  for (let i = 0; i < notesCopy.length; i++) {
    if (notesCopy[i].done == true) {
      let node = document.getElementById(notesCopy[i].id.toString());
      node!.remove();
      let toRemove = notes.findIndex(e => e.id == notesCopy[i].id);
      notes.splice(toRemove, 1);
    }    
  }
  updateCounter();
}

function updateCounter() {
  let count = notes.length; 
  
  if (count === 0) {
    asideStyle.style.visibility = "hidden";
    checkAllButton.style.visibility = "hidden";
    clearCompletedButton.style.visibility = "hidden";
  } 
  else {
    asideStyle.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";
    clearCompletedButton.style.visibility = "hidden";

    notes.forEach((note) => {
      if (note.done === true) {
        count--;
      }
    });
    
    if (count < notes.length) {
      clearCompletedButton.style.visibility = "visible";
    }
    if (count === 1) {
      counter.textContent = "1 item left";
    }
    else if (count == notes.length) {
      counter.textContent = count + " items left";
      clearCompletedButton.style.visibility = "hidden";
    }
    else {
      counter.textContent = count + " items left";
    }
  }
  updateLocalStorage();
}

// Id skickas med nu, rensas bort i loadLocalStorage sen
function updateLocalStorage() {
  localStorage.clear();
  notes.forEach((element) => {    
    localStorage.setItem(element.id + '$' + element.text, element.done.toString());
  });
}
