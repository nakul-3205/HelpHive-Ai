import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // For programmatic navigation, e.g., on error
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error messages

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          setError(data.message || "Failed to fetch ticket details.");
          console.error(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        setError("Network error or server unavailable. Could not load ticket.");
        console.error("Error fetching ticket details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-blue-950 font-inter">
        <div className="flex flex-col items-center">
          <span className="loading loading-spinner loading-lg text-blue-400"></span>
          <p className="mt-4 text-xl text-blue-200 animate-pulse">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-blue-950 p-4 font-inter">
        <div role="alert" className="alert alert-error bg-red-800 text-white max-w-lg shadow-xl border border-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-8 w-8"
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
          <span className="text-xl font-medium">{error}</span>
          <div>
            <button className="btn btn-sm btn-outline btn-error text-white border-red-400 hover:bg-red-700 hover:border-red-700" onClick={() => navigate('/tickets')}>
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-blue-950 font-inter">
        <div role="alert" className="alert alert-warning bg-yellow-800 text-white max-w-lg shadow-xl border border-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-8 w-8" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="text-xl font-medium">Ticket not found or accessible.</span>
          <div>
            <button className="btn btn-sm btn-outline btn-warning text-white border-yellow-400 hover:bg-yellow-700 hover:border-yellow-700" onClick={() => navigate('/tickets')}>
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "badge-info bg-blue-600 text-white border-blue-400";
      case "in progress":
        return "badge-warning bg-yellow-600 text-white border-yellow-400";
      case "closed":
        return "badge-success bg-green-600 text-white border-green-400";
      case "reopened":
        return "badge-error bg-red-600 text-white border-red-400";
      default:
        return "badge-ghost bg-gray-600 text-gray-200 border-gray-400";
    }
  };

  // Helper to get priority badge color
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "badge-error bg-red-600 text-white border-red-400";
      case "medium":
        return "badge-warning bg-yellow-600 text-white border-yellow-400";
      case "low":
        return "badge-info bg-blue-600 text-white border-blue-400";
      default:
        return "badge-ghost bg-gray-600 text-gray-200 border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 p-4 sm:p-6 lg:p-10 font-inter">
      <div className="w-full max-w-5xl mx-auto bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 border border-blue-700 border-opacity-30 backdrop-blur-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md">
            Ticket Details
          </h1>
          <button className="btn btn-ghost btn-sm text-blue-300 hover:text-cyan-300 hover:bg-gray-800 transition-colors duration-200" onClick={() => navigate('/tickets')}>
            &larr; Back to all Tickets
          </button>
        </div>

        <div className="card bg-gray-800 shadow-xl p-8 space-y-6 border border-blue-700 border-opacity-40 rounded-2xl transform transition-transform duration-300 hover:scale-[1.005] hover:shadow-blue-900/50">
          <h2 className="card-title text-3xl text-blue-300 mb-2 font-bold drop-shadow-sm">
            {ticket.title}
          </h2>

          <div className="text-blue-200 text-opacity-80 text-lg">
            <h3 className="font-bold text-xl mb-2 text-blue-300">Description:</h3>
            <p>{ticket.description}</p>
          </div>

          {/* Metadata Section */}
          {(ticket.status || ticket.priority || ticket.relatedSkills?.length > 0 || ticket.assignedTo || ticket.createdAt) && (
            <>
              <div className="divider text-blue-400 text-opacity-70 text-lg font-semibold">
                Ticket Metadata
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-200 text-lg">
                {ticket.status && (
                  <p>
                    <strong className="text-blue-300">Status:</strong>{" "}
                    <span className={`badge ${getStatusBadgeClass(ticket.status)} font-bold text-sm px-3 py-2 rounded-full`}>
                      {ticket.status}
                    </span>
                  </p>
                )}
                {ticket.priority && (
                  <p>
                    <strong className="text-blue-300">Priority:</strong>{" "}
                    <span className={`badge ${getPriorityBadgeClass(ticket.priority)} font-bold text-sm px-3 py-2 rounded-full`}>
                      {ticket.priority}
                    </span>
                  </p>
                )}
                {ticket.assignedTo && (
                  <p>
                    <strong className="text-blue-300">Assigned To:</strong>{" "}
                    <span className="font-medium text-cyan-300">
                      {ticket.assignedTo?.email || "N/A"}
                    </span>
                  </p>
                )}
                {ticket.createdAt && (
                  <p>
                    <strong className="text-blue-300">Created At:</strong>{" "}
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                )}
                {ticket.updatedAt && ticket.createdAt !== ticket.updatedAt && (
                  <p>
                    <strong className="text-blue-300">Last Updated:</strong>{" "}
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
              {ticket.relatedSkills?.length > 0 && (
                <div className="mt-4">
                  <strong className="text-blue-300 text-lg">Related Skills:</strong>{" "}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ticket.relatedSkills.map((skill, index) => (
                      <span key={index} className="badge badge-outline badge-info text-blue-300 border-blue-500 font-semibold text-sm px-3 py-2 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Helpful Notes Section (Markdown) */}
          {ticket.helpfulNotes && (
            <div className="mt-6">
              <h3 className="font-bold text-xl mb-3 text-cyan-300">Helpful Notes:</h3>
              <div className="prose prose-lg max-w-none p-6 bg-gray-700 rounded-lg shadow-inner text-blue-100 border border-blue-600">
                <ReactMarkdown>{ticket.helpfulNotes}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Back button at the bottom */}
          <div className="card-actions justify-end mt-8">
            <button className="btn btn-primary btn-lg shadow-lg shadow-blue-700/40 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/60 active:scale-98 active:shadow-md border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xl" onClick={() => navigate('/tickets')}>
              Back to all Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
