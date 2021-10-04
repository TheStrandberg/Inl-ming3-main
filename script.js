const noteTemplate = document.querySelector('#list-item');
const notesList = document.getElementById('notes-list');
const form = document.querySelector('form');
const formText = document.getElementById('searchbar');
const counter = document.getElementById('items-left');


form.onsubmit = event => {
    event.preventDefault();

    const note = noteTemplate.content.firstElementChild.cloneNode(true);
    const noteText = formText.value;

    note.querySelector('span').textContent = noteText;

    const deleteButton = note.querySelector('button');
    deleteButton.onclick = event => {
        note.remove();
        updateCounter();
    }
    
    notesList.append(note);
    formText.value = '';

    updateCounter();
}

function updateCounter() {
    let count = notesList.getElementsByTagName('li').length;
    if (count == 1) {
        counter.textContent = count + 'item left';        
    }
    else if (count == 0) {
        counter.textContent = '';
    }
    else {
        counter.textContent = count + 'items left';
    }
}