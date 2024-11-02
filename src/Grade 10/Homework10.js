import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase"; // Ensure your Firebase config is correctly imported
import Sidebar from "../Sidebar10";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Homework10 = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To track errors

  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "homework10")); // Updated collection for Grade 10

        if (querySnapshot.empty) {
          console.log("No documents found in the homework collection.");
          setHomeworkData([]);
          return;
        }

        // Process each document and retrieve download URLs
        const downloadUrlPromises = querySnapshot.docs.map(async (doc) => {
          const { title, fileURL } = doc.data();
          let pdfLink = '';

          // Get download URL if fileURL exists
          if (fileURL) {
            try {
              const pdfRef = ref(storage, fileURL);
              pdfLink = await getDownloadURL(pdfRef);
            } catch (urlError) {
              console.error("Error getting download URL:", urlError);
              pdfLink = ''; // Set to empty if there's an error
            }
          }

          const currentDate = new Date();
          const dueDate = new Date(currentDate);
          dueDate.setDate(currentDate.getDate() + 3); // Set due date to 3 days from now

          return {
            id: doc.id,
            title,
            submissionLink: '/Grade10/Submission10', // Updated link for Grade 10
            pdfLink,
            dueDate: dueDate.toDateString(),
          };
        });

        const homeworkData = await Promise.all(downloadUrlPromises);
        setHomeworkData(homeworkData);
      } catch (error) {
        console.error("Error fetching homework:", error);
        setError("Failed to fetch homework data."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkData();
  }, []);

  // Display loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  // Display error message if there is an error
  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar activeItem="Homework" />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Homework - Grade 10</h2>
        <table className="min-w-full bg-white border border-black-300 rounded-lg shadow-lg">
          <thead className="bg-yellow-400">
            <tr>
              <th className="py-3 px-3 border-b border-yellow-300 text-left text-lg font-semibold text-black">Title</th>
              <th className="py-3 px-3 border-b border-yellow-300 text-left text-lg font-semibold text-black">Homework</th>
              <th className="py-3 px-3 border-b border-yellow-300 text-left text-lg font-semibold text-black">Due Date</th>
              <th className="py-3 px-3 border-b border-yellow-300 text-left text-lg font-semibold text-black">Submission Link</th>
            </tr>
          </thead>
          <tbody>
            {homeworkData.length > 0 ? (
              homeworkData.map(hw => (
                <tr key={hw.id} className="hover:bg-yellow-50 transition duration-200">
                  <td className="py-4 px-4 border-b border-gray-300 text-lg">{hw.title}</td>
                  <td className="py-4 px-4 border-b border-gray-300 text-lg">
                    {hw.pdfLink ? (
                      <a href={hw.pdfLink} target="_blank" rel="noopener noreferrer" className="text-black underline hover:text-yellow-500 hover:underline">View Homework</a>
                    ) : (
                      'No file uploaded'
                    )}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300 text-lg">{hw.dueDate}</td>
                  <td className="py-4 px-4 border-b border-gray-300 text-lg">
                    <Link to={hw.submissionLink} className="text-black underline hover:text-yellow-500 hover:underline">Submit here</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-lg">No homework available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homework10;
