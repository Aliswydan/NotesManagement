import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); 

  async  function onLogout () {
    axios.post("/logout").then(() => {
      localStorage.removeItem("isAuthenticated"); // Remove authentication state
      navigate("/");
    });
  };
  

  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
      <div class="row">
        <div class="col">
          <div class="text-end ">
      <button 
      className="btn btn-danger "
      onClick={onLogout}>Logout
      </button>

</div>
    </div>
</div>

    </header>
  );
}

export default Header;
