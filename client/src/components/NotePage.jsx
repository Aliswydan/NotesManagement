import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";


function NotePage() {
  const [notes, setNotes] = useState([]);


  const [currentNote, setCurrentNote] = useState(null);
  // Function to add a note
  async function addNote(newNote) {
    try {
      const response = await axios.post("/add", newNote);
      console.log("Note added:", response.data);
      setNotes((prevNotes) => [ response.data, ...prevNotes]); 
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/list");
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);


  async function editNote(id, updatedNote) {
    try {
      const response = await axios.put(`/edit/${id}`, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.todo_id === id ? response.data : note
    ));
    
  } catch (error) {
    console.error("Error editing note:", error);
  }
}
  



  async function deleteNote(id) {
    try {
      await axios.delete(`/delete/${id}`);
      // Remove the deleted note from the state
      setNotes((prevNotes) => prevNotes.filter((note) => note.todo_id !== id)); 

    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }



    
  return (
    <div>
      <Header />
      



      <CreateArea
      onAdd={addNote}
      onEdit={(id, updatedNote) => editNote(id, updatedNote)}
      currentNote={currentNote}
      setCurrentNote={setCurrentNote}
    />


      {notes.map((noteItem) => (
        <Note
          key={noteItem.todo_id} 
          id={noteItem.todo_id}
          title={noteItem.title}
          content={noteItem.description} 
          onDelete={deleteNote}
          onEdit={() => setCurrentNote(noteItem)}
        />
      ))}
      <Footer
       />
    </div>
  );
}

export default NotePage;
