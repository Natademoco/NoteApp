function main() {
  const baseUrl = "https://notes-api.dicoding.dev/v2";

  const showResponseMessage = (message = "Check your internet connection") => {
    alert(message);
  };

  const getNotes = () => {
    fetch(`${baseUrl}/notes`)
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.error) {
          showResponseMessage(responseJson.message);
        } else {
          renderAllNotes(responseJson.data);
          attachDeleteListeners();
        }
      })
      .catch((error) => {
        showResponseMessage(error);
      });
  };

  const insertNote = async (note) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": "12345",
        },
        body: JSON.stringify(note),
      };

      const response = await fetch(`${baseUrl}/notes`, options);
      const responseJson = await response.json();
      showResponseMessage(responseJson.message);
      getNotes();
    } catch (error) {
      showResponseMessage(error);
    }
  };

  const removeNote = (noteId) => {
    fetch(`${baseUrl}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "X-Auth-Token": "12345",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        showResponseMessage(responseJson.message);
        getNotes();
      })
      .catch((error) => {
        showResponseMessage(error);
      });
  };

  const renderAllNotes = (notes) => {
    const noteListElement = document.getElementById("note-list");
    noteListElement.innerHTML = "";

    notes.forEach((note) => {
      noteListElement.innerHTML += `
        <div class="card col-md-6 bg-light mt-2">
            <div class="card-body">
                <h5 class="card-title">${note.title}</h5>
                <p class="card-text">${note.body}</p>
                <button
                type="button"
                class="btn btn-danger delete-note"
                id="${note.id}">
                Delete
                </button>
            </div>
        </div>
          `;
    });
  };

  const attachDeleteListeners = () => {
    const buttonDelete = document.querySelectorAll('.delete-note');
    buttonDelete.forEach((button) => {
      button.addEventListener('click', (event) => {
        const noteId = event.target.id;
        removeNote(noteId);
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const noteTitle = document.getElementById('note-title')
    const noteBody = document.getElementById('note-body')
    const buttonSave = document.getElementById('save-note')

    buttonSave.addEventListener('click', function () {
      const note = {
        title: noteTitle.value,
        body: noteBody.value
      }

      insertNote(note)
    });

    getNotes();
  });
}

export default main;
