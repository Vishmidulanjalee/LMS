import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import Sidebar from './Sidebar';

const Homework = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        const homeworkList = [];
        const querySnapshot = await getDocs(collection(db, "homework"));

        console.log("Query Snapshot: ", querySnapshot);
        console.log("Number of documents fetched:", querySnapshot.size);

        if (querySnapshot.empty) {
          console.log("No documents found in the homework collection.");
          setHomeworkData([]);
          return;
        }

        for (const doc of querySnapshot.docs) {
          const { title, fileURL } = doc.data();
          console.log("Document Data: ", { title, fileURL });

          let pdfLink = '';

          if (fileURL) {
            const pdfRef = ref(storage, fileURL);
            pdfLink = await getDownloadURL(pdfRef);
            console.log("Fetched PDF Link: ", pdfLink);
          }

          const currentDate = new Date();
          const dueDate = new Date(currentDate);
          dueDate.setDate(currentDate.getDate() + 3);

          homeworkList.push({
            id: doc.id,
            title,
            submissionLink: 'https://submission-link.com',
            pdfLink,
            dueDate: dueDate.toDateString(),
          });
        }

        console.log("Fetched Homework Data: ", homeworkList);
        setHomeworkData(homeworkList);
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
      <div className="flex-1 container mx-auto px-20 py-8 pt-4 bg-slate-50">
        <h2 className="text-3xl font-bold mb-12">Homework</h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Homework</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">PDF</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Due Date</th>
              <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Submission Link</th>
            </tr>
          </thead>
          <tbody>
            {homeworkData.length > 0 ? (
              homeworkData.map(hw => (
                <tr key={hw.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="py-4 px-4 border-b border-gray-300">{hw.title}</td>
                  <td className="py-4 px-4 border-b border-gray-300">
                    {hw.pdfLink ? (
                      <a href={hw.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View PDF</a>
                    ) : (
                      'No file uploaded'
                    )}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-300">{hw.dueDate}</td>
                  <td className="py-4 px-4 border-b border-gray-300">
                    <a href={hw.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Submit here</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center">No homework available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homework;
