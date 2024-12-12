import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';

function Note(props) {


  function handleClickDelete() {
    console.log(props.id);
    props.onDelete(props.id);
  }
  function handleClickEdit() {
    console.log(props.id);
    props.onEdit();
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleClickDelete}>
        <DeleteIcon />
      </button>
      <button onClick={handleClickEdit}>
        <EditIcon />
      </button>
    </div>
  );
}

export default Note;
