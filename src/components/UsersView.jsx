import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { apiFetch } from "../lib/api";
import Pagination from "./Pagination";

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchTerm]);

  async function fetchUsers() {
    setUsersLoading(true);
    try {
      const res = await apiFetch(
        `/users?page=${currentPage}&limit=${pageSize}&search=${debouncedSearchTerm}`
      );
      const data = await res.json();

      if (data.users) {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
        setTotalUsers(data.totalUsers || 0);
      } else {
        // Fallback for API that doesn't support pagination
        const allUsers = await apiFetch("/users");
        const allData = await allUsers.json();
        const filteredUsers = debouncedSearchTerm
          ? allData.filter(
              (user) =>
                user.username
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase()) ||
                user.email
                  .toLowerCase()
                  .includes(debouncedSearchTerm.toLowerCase())
            )
          : allData;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setUsers(filteredUsers.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredUsers.length / pageSize));
        setTotalUsers(filteredUsers.length);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const exportUsers = () => {
    // Export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Username,Email\n" +
      users.map((user) => `${user.username},${user.email}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const response = await apiFetch(`/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        // Refresh users list
        fetchUsers();
        alert(`User role changed to ${newRole} successfully!`);
      } else {
        alert("Failed to change user role");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
      alert("Error changing user role");
    }
  };

  if (usersLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: "#DE5499" }}
        ></div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={exportUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Export Users
          </button>
        </div>
      </div>

      {/* Table with responsive design */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={user.role || "user"}
                    onChange={(e) => changeUserRole(user._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <FaEye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800 transition-colors">
                      <FaEdit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalUsers}
        itemsPerPage={pageSize}
        showingText="Showing"
      />
    </div>
  );
};

export default UsersView;
