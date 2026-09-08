import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoBig from './assets/LogoBig.png';
import { getCertificate } from './Spoken/certificateApi';

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

/**
 * Public, unauthenticated verification page. The QR on a certificate only
 * encodes this page's URL with the certificate's document ID — nothing else —
 * so what's shown here is always a live read of the current Firestore record.
 */
const VerifyCertificate = () => {
  const { certId } = useParams();
  const [status, setStatus] = useState('loading'); // loading | found | not-found | error
  const [cert, setCert] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getCertificate(certId);
        if (cancelled) return;
        if (result) {
          setCert(result);
          setStatus('found');
        } else {
          setStatus('not-found');
        }
      } catch (err) {
        console.error('Failed to load certificate:', err);
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [certId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 p-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={LogoBig} alt="The BEE Academy" className="h-16 mx-auto mb-6" />

        {status === 'loading' && (
          <>
            <div className="flex items-center justify-center mb-5">
              <svg className="animate-spin h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Checking certificate…</p>
          </>
        )}

        {status === 'found' && (
          <>
            {cert.photoUrl ? (
              <img
                src={cert.photoUrl}
                alt={cert.studentName}
                className="h-24 w-24 rounded-full object-cover mx-auto mb-5 border-4 border-green-100"
              />
            ) : (
              <div className="flex items-center justify-center mb-5">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}

            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
              ✓ Verified
            </span>

            <h1 className="text-xl font-bold text-gray-900 mb-1">{cert.studentName}</h1>
            <p className="text-gray-500 text-sm mb-6">
              has successfully completed the <span className="font-semibold text-amber-500">Spoken English Programme</span>
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Student ID</span>
                <span className="font-semibold text-gray-800">{cert.studentId || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Result</span>
                <span className="font-semibold text-gray-800">{cert.result || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completion date</span>
                <span className="font-semibold text-gray-800">{formatDate(cert.completionDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Certificate ID</span>
                <span className="font-mono text-xs text-gray-400 break-all">{cert.id}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Issued by The BEE Academy. This page confirms completion by reading live data — it cannot be forged by editing the link.
            </p>
          </>
        )}

        {(status === 'not-found' || status === 'error') && (
          <>
            <div className="flex items-center justify-center mb-5">
              <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {status === 'error' ? 'Could not check this certificate' : 'Certificate not found'}
            </h1>
            <p className="text-gray-500 text-sm">
              {status === 'error'
                ? 'Something went wrong while verifying. Please try again in a moment.'
                : 'This certificate ID does not match any record. It may be invalid or have been revoked.'}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyCertificate;
