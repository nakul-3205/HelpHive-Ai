import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    setLoadingTickets(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        setError(data.message || "Failed to fetch tickets.");
        console.error("Failed to fetch tickets:", data.message);
      }
    } catch (err) {
      setError("Network error or server unavailable. Please check your connection.");
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTicket(true);
    setError(null);
    setShowSuccessToast(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets();
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setError(data.message || "Ticket creation failed. Please ensure all fields are valid.");
        console.error("Ticket creation failed:", data.message);
      }
    } catch (err) {
      setError("Error creating ticket. Network issue or server problem.");
      console.error("Error creating ticket:", err);
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-950 p-4 sm:p-6 lg:p-10 flex flex-col items-center font-inter"> {/* Deep dark background */}
      <div className="w-full max-w-6xl mx-auto bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 border border-blue-700 border-opacity-30 backdrop-blur-md">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 drop-shadow-xl tracking-wide">
            Help Hive <span className="text-blue-200">System</span> 🚀
          </h1>
          <p className="text-2xl text-blue-100 text-opacity-80 font-light tracking-wide">
            Your direct line to <span className="text-cyan-300 font-semibold">Support & Solutions</span>
          </p>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="toast toast-end toast-bottom z-50">
            <div className="alert alert-success bg-green-700 text-white shadow-lg border border-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-7 w-7" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-lg font-medium">Ticket submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
          <div role="alert" className="alert alert-error bg-red-800 text-white mb-10 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.005] border border-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-9 w-9"
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
            <span className="text-2xl font-semibold">{error}</span>
            <button className="btn btn-sm btn-outline btn-error text-white border-red-400 hover:bg-red-700 hover:border-red-700 ml-auto" onClick={fetchTickets}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.928a2.358 2.358 0 012.036 1.092c.652 1.354.49 3.011-.47 4.286l-2.036 2.036a3.611 3.611 0 01-3.882.894M13.2 20.73H8.272a2.358 2.358 0 01-2.036-1.092c-.652-1.354-.49-3.011.47-4.286l2.036-2.036a3.611 3.611 0 013.882-.894" />
              </svg>
              Retry
            </button>
          </div>
        )}

        {/* Create Ticket Section */}
        <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl border border-blue-700 border-opacity-40 mb-16 transform transition-transform duration-300 hover:scale-[1.005] hover:shadow-blue-900/50">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-300 drop-shadow-md">
            Submit a New Request
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-blue-200 text-xl font-semibold">Ticket Title</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Briefly summarize your issue or request"
                className="input input-bordered input-primary w-full text-blue-100 text-xl p-4 rounded-xl bg-gray-700 border-blue-600 focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-blue-200 text-xl font-semibold">Detailed Description</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide all necessary details, steps to reproduce, or desired outcomes."
                className="textarea textarea-bordered textarea-primary w-full h-48 text-blue-100 text-xl p-4 rounded-xl bg-gray-700 border-blue-600 focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-y shadow-inner"
                required
              ></textarea>
            </div>
            <button
              className="btn btn-primary btn-lg w-full mt-8 shadow-lg shadow-blue-700/40 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/60 active:scale-98 active:shadow-md border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xl"
              type="submit"
              disabled={submittingTicket}
            >
              {submittingTicket ? (
                <>
                  <span className="loading loading-spinner loading-lg"></span>
                  Submitting Request...
                </>
              ) : (
                "Send New Request"
              )}
            </button>
          </form>
        </div>

        {/* Your Tickets Section */}
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-300 drop-shadow-md">
          Your Recent Tickets
        </h2>
        {loadingTickets ? (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-800 rounded-xl shadow-inner p-10 border border-blue-700 border-opacity-40">
            <span className="loading loading-dots loading-lg text-blue-400"></span>
            <p className="mt-6 text-2xl text-blue-200 font-medium animate-pulse">Fetching your support requests...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center text-2xl text-blue-200 py-20 bg-gray-800 rounded-xl shadow-inner p-10 border border-dashed border-blue-700 border-opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32 mx-auto text-blue-500 opacity-70 mb-6 drop-shadow-lg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m-4.5 4.5H12a2.25 2.25 0 002.25-2.25V9.75M12 4.5V2.25c0-.621-.504-1.125-1.125-1.125H9.75M9.75 4.5v-1.5M6 18.75h3.75m-3.75 0a1.125 1.125 0 01-1.125-1.125V14.25m1.125 4.5a1.125 1.125 0 001.125-1.125V14.25m0 0a.563.563 0 01.563-.563c.196 0 .38-.103.486-.279.122-.215.16-.47.1-.722l-.374-1.5c-.179-.717-.99-1.207-1.782-1.015L9.2 8.25m0 0l-1.5 1.5M5.25 12H3.656a1.125 1.125 0 01-1.097-1.32l1.306-4.717a1.125 1.125 0 011.097-.872h2.218c.214 0 .422.02.622.06M5.25 12a2.25 2.25 0 002.25 2.25h2.25M5.25 12H3.656a1.125 1.125 0 01-1.097-1.32l1.306-4.717a1.125 1.125 0 011.097-.872h2.218c.214 0 .422.02.622.06m-5.143 7.5c.07.728.327 1.42.77 2.046a3.597 3.597 0 002.62 1.345 3.597 3.597 0 002.62-1.345 3.597 3.597 0 00.77-2.046m-9.286 0H2.25m9.286 0h9.286" />
            </svg>
            <p className="font-extrabold mb-3 text-blue-300">No tickets submitted by Nakul yet. 🤷‍♂️</p>
            <p className="text-xl text-blue-200 text-opacity-70">
              Your support journey starts here! Submit a new request using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                className="card bg-gray-800 shadow-xl border border-blue-700 border-opacity-40 transform transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:shadow-blue-800/60 group cursor-pointer rounded-xl"
                to={`/tickets/${ticket._id}`}
              >
                <div className="card-body p-7">
                  <h3 className="card-title text-2xl text-blue-300 mb-2 group-hover:text-cyan-300 transition-colors duration-200 font-semibold">
                    {ticket.title}
                    {/* Placeholder status badge for consistent UI, not tied to model data */}
                    <div className={`badge badge-outline badge-info ml-3 text-sm font-bold border-blue-500 text-blue-300`}>
                      Open
                    </div>
                  </h3>
                  <p className="text-blue-200 text-opacity-80 line-clamp-3 text-base">
                    {ticket.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-blue-300 text-opacity-60 mt-5">
                    <p>Created: <span className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span></p>
                    {/* Removed conditional rendering for updatedAt to simplify as per "raw code only" */}
                    {/* <p>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</p> */}
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <span className="badge badge-primary bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-base font-semibold py-3 px-5 rounded-full shadow-md group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-300">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
