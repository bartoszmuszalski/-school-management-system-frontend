import React, { useState } from "react";
import axios from "axios";
import "./ClassRoom.css"; // Reuse existing styles
import { useNavigate } from "react-router-dom";
import apiConfig from "../../config";

function CreateClassRoom() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // For navigation after creation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${apiConfig.apiUrl}/api/v1/class_room/create`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming a successful creation returns status 201 or similar
      if (response.status === 201 || response.data.status === "success") {
        // Navigate to classroom list with success message
        navigate("/classroom", {
          state: {
            successMessage: `ClassRoom "${name}" has been successfully added.`,
          },
        });
      } else {
        setError("Failed to create classroom.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "VALIDATION.CLASS_ROOM_ALREADY_EXISTS"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <p className="myParagraphClass">Create a new classroom</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label
            className="label"
            htmlFor="className"
            style={{
              margin: "auto",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            New classroom name:
          </label>
          <input
            type="text"
            id="className"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter classroom name"
            style={{ width: "200px", margin: "auto" }}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button
          type="submit"
          className="VerifyButton"
          style={{ width: "200px", margin: "auto" }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create classroom"}
        </button>
      </form>
    </div>
  );
}

export default CreateClassRoom;
