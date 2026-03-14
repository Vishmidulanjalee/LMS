import React, { useEffect, useState } from 'react';
import { FaLaptop, FaMicrophone } from 'react-icons/fa';
import BeeIcon from './assets/Logo.png';
import BackgroundImage from './assets/background.jpg';

const StudentTypeSelection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .sst-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #fdf8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 48px 24px;
        }

        .sst-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.06;
          z-index: 0;
          mix-blend-mode: multiply;
        }

        /* Soft radial glow */
        .sst-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 20% 10%, rgba(251,191,36,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(217,119,6,0.10) 0%, transparent 55%);
          z-index: 0;
          pointer-events: none;
        }

        /* Decorative rings */
        .sst-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(217,119,6,0.10);
          pointer-events: none;
          z-index: 0;
        }
        .sst-ring-1 { width: 520px; height: 520px; top: -140px; left: -160px; }
        .sst-ring-2 { width: 340px; height: 340px; bottom: -80px; right: -80px; }

        .sst-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 860px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .sst-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Brand pill */
        .sst-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(217,119,6,0.18);
          border-radius: 100px;
          padding: 8px 18px;
          margin-bottom: 36px;
          box-shadow: 0 2px 16px rgba(217,119,6,0.08);
        }
        .sst-brand img { height: 22px; width: 22px; object-fit: contain; }
        .sst-brand span {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.04em;
          color: #92400e;
        }

        /* Heading */
        .sst-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 700;
          color: #1c1409;
          text-align: center;
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .sst-heading .accent { color: #d97706; }

        .sst-sub {
          font-size: 15px;
          color: #78716c;
          font-weight: 400;
          text-align: center;
          max-width: 400px;
          line-height: 1.65;
          margin-bottom: 52px;
        }

        /* Cards grid */
        .sst-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          width: 100%;
        }

        .sst-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(217,119,6,0.12);
          border-radius: 24px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
          box-shadow: 0 4px 24px rgba(120,80,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
          backdrop-filter: blur(12px);
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease, border-color 0.2s;
          position: relative;
          overflow: hidden;
        }

        .sst-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 0 0 24px 24px;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .sst-card.online::after { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .sst-card.spoken::after { background: linear-gradient(90deg, #374151, #111827); }

        .sst-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(120,80,0,0.13), 0 2px 8px rgba(0,0,0,0.06);
        }
        .sst-card:hover::after { opacity: 1; }
        .sst-card.online:hover { border-color: rgba(217,119,6,0.35); }
        .sst-card.spoken:hover { border-color: rgba(55,65,81,0.35); }

        /* Icon badge */
        .sst-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          flex-shrink: 0;
        }
        .sst-icon-wrap.online { background: linear-gradient(135deg, #fef3c7, #fde68a); }
        .sst-icon-wrap.spoken { background: linear-gradient(135deg, #f3f4f6, #e5e7eb); }

        .sst-card-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .sst-card-tag.online { color: #d97706; }
        .sst-card-tag.spoken { color: #6b7280; }

        .sst-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1c1409;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .sst-card-desc {
          font-size: 14px;
          color: #78716c;
          line-height: 1.7;
          margin-bottom: 32px;
          flex-grow: 1;
        }

        .sst-features {
          list-style: none;
          padding: 0; margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .sst-features li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #57534e;
          font-weight: 400;
        }
        .sst-features li::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .sst-card.online .sst-features li::before { background: #f59e0b; }
        .sst-card.spoken .sst-features li::before { background: #9ca3af; }

        .sst-btn {
          width: 100%;
          padding: 14px 24px;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: auto;
        }
        .sst-btn.online {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          box-shadow: 0 4px 16px rgba(217,119,6,0.28);
        }
        .sst-btn.online:hover {
          background: linear-gradient(135deg, #fbbf24, #b45309);
          box-shadow: 0 6px 24px rgba(217,119,6,0.38);
          transform: translateY(-1px);
        }
        .sst-btn.spoken {
          background: #111827;
          color: #fff;
          box-shadow: 0 4px 16px rgba(17,24,39,0.18);
        }
        .sst-btn.spoken:hover {
          background: #1f2937;
          box-shadow: 0 6px 24px rgba(17,24,39,0.28);
          transform: translateY(-1px);
        }
        .sst-btn svg { font-size: 13px; opacity: 0.85; }

        /* Arrow */
        .btn-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .sst-btn:hover .btn-arrow { transform: translateX(3px); }

        /* Footer note */
        .sst-footer {
          margin-top: 40px;
          font-size: 13px;
          color: #a8a29e;
          text-align: center;
        }
        .sst-footer a { color: #d97706; text-decoration: none; font-weight: 500; }
        .sst-footer a:hover { text-decoration: underline; }

        @media (max-width: 640px) {
          .sst-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sst-root">
        <img src={BackgroundImage} alt="" className="sst-bg-img" aria-hidden="true" />
        <div className="sst-ring sst-ring-1" />
        <div className="sst-ring sst-ring-2" />

        <div className={`sst-content ${visible ? 'visible' : ''}`}>

          {/* Brand */}
          <div className="sst-brand">
            <img src={BeeIcon} alt="The BEE Academy" />
            <span>The BEE Academy</span>
          </div>

          {/* Heading */}
          <h1 className="sst-heading">
            How are you joining<br />
            <span className="accent">The BEE Academy?</span>
          </h1>
          <p className="sst-sub">
            Choose your learning path to access the right tools, content, and experience for you.
          </p>

          {/* Cards */}
          <div className="sst-cards">

            {/* Online Student */}
            <div className="sst-card online">
              <div className="sst-icon-wrap online">
                <FaLaptop size={26} color="#d97706" />
              </div>
              <div className="sst-card-tag online">Digital Learning</div>
              <div className="sst-card-title">Online Student</div>
              <p className="sst-card-desc">
                Full access to your enrolled courses, live sessions, and personal progress tracking — all in one place.
              </p>
              <ul className="sst-features">
                <li>Class recordings & replays</li>
                <li>Past papers & tutorials</li>
                <li>Progress dashboard</li>
                <li>Assignment submissions</li>
              </ul>
              <button
                className="sst-btn online"
                onClick={() => window.location.href = '/signin'}
              >
                Sign In to Your Account <span className="btn-arrow">→</span>
              </button>
            </div>

            {/* Spoken Student */}
            <div className="sst-card spoken">
              <div className="sst-icon-wrap spoken">
                <FaMicrophone size={26} color="#374151" />
              </div>
              <div className="sst-card-tag spoken">In-Person Learning</div>
              <div className="sst-card-title">Spoken Student</div>
              <p className="sst-card-desc">
                Attending physical classes? Access your class schedule, materials, and session resources here.
              </p>
              <ul className="sst-features">
                <li>Class schedules & notices</li>
                <li>Downloadable resources</li>
                <li>Preview course content</li>
                <li>Contact your teachers</li>
              </ul>
              <button
                className="sst-btn spoken"
                onClick={() => window.location.href = '/GuestDashboard'}
              >
                Enter as Spoken Student <span className="btn-arrow">→</span>
              </button>
            </div>

          </div>

          <p className="sst-footer">
            New to The BEE Academy? <a href="/Signup">Create an account</a> · Need help? <a href="/support">Contact us</a>
          </p>

        </div>
      </div>
    </>
  );
};

export default StudentTypeSelection;