const noteColors = [
  "#EDF2FB", "#E2EAFC", "#FFE5EC", "#FFC2D1", "#D7E3FC",
  "#B7EFC5", "#FFEDD8", "#FDF8E1", "#F4EFFA", "#C8B1E4"
];

function popup() {
    const popupContainer = document.createElement("div");

    popupContainer.innerHTML = `<div id="popupContainer">
                            <h1>New Note</h1>
                            <textarea id="note-text" placeholder="Enter your note..."></textarea>
                            <div id="btn-container">
                            <button id="submitBtn" onclick="createNote ()">Create Note</button>
                            <button id="closeBtn" onclick="closePopup()">Close</button>
                            </div>
                            </div>`;
    document.body.appendChild(popupContainer);
}

function closePopup() {
  const popupContainer = document.getElementById("popupContainer");
  if (popupContainer) {
    popupContainer.remove();
  }
}


function createNote() {
    const popupContainer = document.getElementById("popupContainer");
    const noteText = document.getElementById("note-text").value;
    if (noteText.trim() !== "") {
        const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
        const note = {
        id: new Date().getTime(),
        text: noteText,
        color:randomColor
        };
        const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];
        existingNotes.push(note);
        localStorage.setItem("notes", JSON.stringify(existingNotes));
        document.getElementById("note-text").value = "";
        popupContainer.remove();
        displayNotes();
    }
}

function displayNotes() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = ``;

  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((note) => {
    const listItem = document.createElement("li");
    listItem.style.backgroundColor = note.color ;
    listItem.innerHTML = `
      <span>${note.text}</span>
      <div id="noteBtns-container">
        <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
        <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
      </div>`;

    notesList.appendChild(listItem);
    
  });
  checkOverflow();
}


function editNote(noteId) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const noteToEdit = notes.find((note) => note.id == noteId);
  const noteText = noteToEdit ? noteToEdit.text : "";
  const editingPopup = document.createElement("div");
  editingPopup.innerHTML = `
                            <div id="editing-container" data-note-id="${noteId}"> 
                            <h1>Edit Note</h1>
                            <textarea id="note-text">${noteText}</textarea> <div id="btn-container">
                            <button id="submitBtn" onclick="updateNote()">Done</button>
                            <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
                            </div>
                            </div>`;
  document.body.appendChild(editingPopup);
}

function closeEditPopup() {
  const editingPopup = document.getElementById("editing-container");

  if (editingPopup) {
    editingPopup.remove();
  }
}
function updateNote() {
  const noteText = document.getElementById("note-text").value.trim();
  const editingPopup = document.getElementById("editing-container");

  if (noteText !== "") {
    const noteId = editingPopup.getAttribute("data-note-id");
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Find the note to update
    const updatedNotes = notes.map((note) => {
      if (note.id == noteId) {
        return { id: note.id, text: noteText, color: note.color };
      }
      return note;
    });

    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    // Close the editing popup
    editingPopup.remove();
    displayNotes();
  }
}
function deleteNote(noteId) {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes = notes.filter((note) => note.id !== noteId);

  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}
function scrollToTop() {
  const container = document.querySelector("#container");
  container.scrollTo({
    top: 0,

  });
}
function checkOverflow() {
  const container = document.getElementById("container");
  const upButton = document.querySelector(".up");

  if (container.scrollHeight > container.clientHeight) {
    upButton.style.display = "flex";
  } else {
    upButton.style.display = "none";
  }
}



displayNotes();
