import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Homework = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        const homeworkList = [];
        const querySnapshot = await getDocs(collection(db, "homework"));
  
        if (querySnapshot.empty) {
          console.log("No documents found in the homework collection.");
          setHomeworkData([]);
          return;
        }
  
        const downloadUrlPromises = querySnapshot.docs.map(async (doc) => {
          const { title, fileURL } = doc.data();
  
          let pdfLink = '';
          if (fileURL) {
            const pdfRef = ref(storage, fileURL);
            pdfLink = await getDownloadURL(pdfRef);
          }
  
          const currentDate = new Date();
          const dueDate = new Date(currentDate);
          dueDate.setDate(currentDate.getDate() + 3);
  
          return {
            id: doc.id,
            title,
            submissionLink: '/HomeworkSubmission', // Updated link to navigate to submission page
            pdfLink,
            dueDate: dueDate.toDateString(),
          };
        });
  
        const homeworkData = await Promise.all(downloadUrlPromises);
        setHomeworkData(homeworkData);
      } catch (error) {
        console.error("Error fetching homework:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHomeworkData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="flex">
      <Sidebar activeItem="Homework" />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Student Homework</h2>
        <table className="min-w-full bg-white border border-black-300 rounded-lg shadow-lg">
          <thead className="bg-yellow-400">
            <tr>
              <th className="py-3 px-3 border-b border-yellow-300 text-left text-lg font-semibold text-black">Homework</th>
              <th className="py-3 px-3 border-b border-yellow-300 text-left text-lg font-semibold text-black">PDF</th>
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

export default Homework;
