import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

function CreateArea({ onAdd, onEdit, currentNote, setCurrentNote }) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    description: "",
  });

  // Populate the form when a note is being edited
  useEffect(() => {
    if (currentNote) {
      setNote({
        title: currentNote.title,
        description: currentNote.description,
      });
      setExpanded(true); // Automatically expand when editing
    }
  }, [currentNote]);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  function submitNote(event) {
    event.preventDefault();
    
    // Trim the note fields
    const trimmedNote = trim(note);
  
    if (currentNote) {
    
      if (trimmedNote.title !== "" || trimmedNote.description !== "") {
        onEdit(currentNote.todo_id, trimmedNote);
        setCurrentNote(null); 
      } else {
        alert("Cannot submit an empty note");
        setCurrentNote(null); 

      }
    } else {
      // Adding a new note
      if (trimmedNote.title !== "" || trimmedNote.description !== "") {
        onAdd(trimmedNote);
      } else {
        alert("Cannot submit an empty note");
      }
    }
  
    setNote({
      title: "",
      description: "",
    });
    setExpanded(false); // Collapse the form after submission
  }
  

  function trim(note) {
    return {
      title: note.title.trim(),
      description: note.description.trim(),
    };
  }
  
  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="description"
          onClick={expand}
          onChange={handleChange}
          value={note.description}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />

        <Zoom in={isExpanded}>
          <Fab
            onClick={() => {
              setCurrentNote(null);
              setNote({ title: "", description: "" });
              setExpanded(false);
            }}
          >
            <CancelIcon />
          </Fab>
        </Zoom>
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
