import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Firebase config import

const Homework = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        const pdfRef = ref(storage, "Homework/engen897.pdf");
        const url = await getDownloadURL(pdfRef);

        const currentDate = new Date();
        const dueDate = new Date(currentDate);
        dueDate.setDate(currentDate.getDate() + 3);

        const homework = [
          { id: 1, title: 'Creative Writing: A day in a magical forest', submissionLink: 'https://submission-link1.com', pdfLink: url, dueDate: dueDate.toDateString() },
        ];

        setHomeworkData(homework);
      } catch (error) {
        console.error("Error fetching homework:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchHomeworkData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Homework</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Homework</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">PDF</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Due Date</th>
            <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Submission Link</th>
          </tr>
        </thead>
        <tbody>
          {homeworkData.map(hw => (
            <tr key={hw.id} className="hover:bg-gray-100 transition duration-200">
              <td className="py-4 px-4 border-b border-gray-300">{hw.title}</td>
              <td className="py-4 px-4 border-b border-gray-300">
                <a href={hw.pdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View PDF</a>
                <div className="mt-2">
                  <iframe src={`${hw.pdfLink}#page=1`} width="100" height="100" className="border border-gray-300 rounded"></iframe>
                </div>
              </td>
              <td className="py-4 px-4 border-b border-gray-300">{hw.dueDate}</td>
              <td className="py-4 px-4 border-b border-gray-300">
                <a href={hw.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Submit here</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Homework;
