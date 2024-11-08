import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Firebase config import
import Sidebar from '../Sidebar6';

const StudentMarks6 = () => {
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarksData = async () => {
      try {
        const marksList = [];
        const querySnapshot = await getDocs(collection(db, "marks6"));

        if (querySnapshot.empty) {
          console.log("No documents found in the marks collection.");
          setMarksData([]); // Set to an empty array if no data
          return;
        }

        querySnapshot.forEach((doc) => {
          const { fileName, fileURL } = doc.data();
          marksList.push({
            id: doc.id,
            fileName,
            fileURL,
          });
        });

        console.log("Fetched marks data:", marksList);
        setMarksData(marksList);
      } catch (error) {
        console.error("Error fetching marks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarksData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading Your Marks...</div>;
  }

  return (
    <div className="flex">
        <Sidebar activeItem="Marks"/>
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 mt-5">Marks - Grade 6</h2>
        <table className="min-w-full bg-white border border-black-300 rounded-lg shadow-lg">
          <thead className="bg-yellow-400">
            <tr>
              <th className="py-3 px-4 border-b border-black-300 text-left text-lg font-semibold text-black">File Name</th>
              <th className="py-3 px-4 border-b border-black-300 text-left text-lg font-semibold text-black">Marks File</th>
            </tr>
          </thead>
          <tbody>
            {marksData.length > 0 ? (
              marksData.map((mark) => (
                <tr key={mark.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-3 px-3 border-b border-black-300 text-lg">{mark.fileName}</td>
                  <td className="py-3 px-3 border-b border-black-300 text-lg">
                    {mark.fileURL ? (
                      <a href={mark.fileURL} target="_blank" rel="noopener noreferrer" className="text-black underline hover:text-yellow-500 hover:underline">
                        View your marks
                      </a>
                    ) : (
                      'No file available'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-4 px-4 text-center text-lg">No marks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentMarks6;