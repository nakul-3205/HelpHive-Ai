import { useEffect, useState } from "react";
// No new direct imports needed for the UI changes, assuming Tailwind CSS and daisyUI are set up.

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Stores email of the user being edited
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // To show loading state
  const [error, setError] = useState(null); // To show errors

  // Assuming 'token' is available in localStorage as per your original code
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data); // Initialize filtered users with all users
      } else {
        setError(data.error || "Failed to fetch users.");
        console.error("Error fetching users:", data.error);
      }
    } catch (err) {
      setError("Network error or server unavailable.");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", ") || "", // Ensure skills is a string for the input
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return; // Should not happen if edit button is correctly managed
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean), // Filter out empty strings from skills array
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update user.");
        console.error("Update failed:", data.error);
        return;
      }

      // On successful update, reset state and refetch users
      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      await fetchUsers(); // Re-fetch to get the latest data
    } catch (err) {
      setError("Network error or server unavailable during update.");
      console.error("Update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query) ||
          user.skills?.some((skill) => skill.toLowerCase().includes(query))
      )
    );
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto bg-base-100 rounded-lg shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-primary">
          Admin Panel <span className="text-base-content">- Manage Users</span>
        </h1>

        <div className="mb-6">
          <input
            type="text"
            className="input input-bordered w-full text-base-content focus:ring-primary focus:border-primary"
            placeholder="Search users by email, role, or skills..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="ml-4 text-lg text-base-content">Loading users...</p>
          </div>
        )}

        {error && (
          <div role="alert" className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-lg">{error}</span>
            <button className="btn btn-sm btn-ghost" onClick={fetchUsers}>Retry</button>
          </div>
        )}

        {!isLoading && !error && filteredUsers.length === 0 && (
          <div className="text-center text-lg text-base-content py-10">
            No users found matching your search.
          </div>
        )}

        {!isLoading && !error && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="card bg-base-200 shadow-md border border-base-300 transform transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="card-body p-6">
                  <h2 className="card-title text-xl text-primary mb-2">
                    {user.email}
                    {user.role === "admin" && (
                      <div className="badge badge-error ml-2">Admin</div>
                    )}
                    {user.role === "moderator" && (
                      <div className="badge badge-warning ml-2">Moderator</div>
                    )}
                  </h2>
                  <p className="text-base-content mb-1">
                    <strong className="text-info">Role:</strong> {user.role}
                  </p>
                  <p className="text-base-content mb-4">
                    <strong className="text-info">Skills:</strong>{" "}
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span key={index} className="badge badge-accent badge-outline mr-1 mb-1">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </p>

                  {editingUser === user.email ? (
                    <div className="mt-4 space-y-3">
                      <select
                        className="select select-bordered w-full text-base-content focus:border-secondary focus:ring-secondary"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Comma-separated skills (e.g., React, Node.js, MongoDB)"
                        className="input input-bordered w-full text-base-content focus:border-secondary focus:ring-secondary"
                        value={formData.skills}
                        onChange={(e) =>
                          setFormData({ ...formData, skills: e.target.value })
                        }
                      />

                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn btn-success btn-sm flex-grow sm:flex-none"
                          onClick={handleUpdate}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm flex-grow sm:flex-none"
                          onClick={() => {
                            setEditingUser(null);
                            setFormData({ role: "", skills: "" }); // Reset form data on cancel
                          }}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}