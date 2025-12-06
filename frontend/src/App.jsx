import { useState, useEffect } from 'react'
import axios from "axios"


function App() {
  const [db, setDb] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [editingUserId, setEditingUserId] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => setDb(res.data.data || []))
  }, [])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE"
      })

      if (!res.ok) throw new Error("Failed to Delete")

      setDb(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      console.log("Failed to Delete", err)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setDb(prev => [...prev, data.data])
      setShowModal(false)
      setUsername("")
      setEmail("")
    } catch (err) {
      console.log("Failed to Create User:", err)
    }
  }

  const handleEditUser = async(id) => {
    try{
      const res = await fetch(`http://localhost:5000/api/users/${id}`)
      if(!res.ok) throw new Error("Failed to Edit")
      const data = await res.json()
      setUsername(data.data.username)
      setEmail(data.data.email)
      setEditingUserId(id)
      setShowModal(true)
    }
    catch(err){
      console.log("Failed to Edit: ", err)
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email })
      });

      const data = await res.json();
      console.log
      if (!res.ok) throw new Error(data.error);

      setDb(prev =>
        prev.map(user =>
          user.id === editingUserId ? { ...user, username, email } : user
        )
      );

      setEditingUserId(null);
      setUsername("");
      setEmail("");
      setShowModal(false);

    } catch (err) {
      console.log("Failed to Update User:", err);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => { setShowModal(true); setEditingUserId(null); }}>Add User</button>
      </div>

      <div>
        {Array.isArray(db) && db.length > 0 ? (
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {db.map((user, idx) => (
                user ? (
                  <tr key={user.id}>
                    <td>{idx + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                      <button onClick={() => handleEditUser(user.id)}>Edit</button>
                    </td>
                  </tr>
                ) : null
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}

        {showModal && (
          <div style={styles.overlay}>
            <div style={styles.modal}>

              <form onSubmit={editingUserId ? handleUpdateUser : handleCreateUser}>
                <h2>{editingUserId ? "Update User" : "Create User"}</h2>

                <div style={{ marginBottom: "10px" }}>
                  <label>Username:</label><br />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>Email:</label><br />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit">
                    {editingUserId ? "Update" : "Create"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUserId(null);
                      setUsername("");
                      setEmail("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default App

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
  }
}
