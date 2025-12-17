import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/FavoritesPage.css";

export default function FavoritesPage() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <DashboardHeader />

        <section className="fav-wrap">
          <h1 className="page-title">Favorites</h1>

          {/* <div className="fav-cards-row">
            <div className="fav-card">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Starred docs</div>
              <div className="tile-sub">128 files</div>
              <div className="tile-underline u-blue" />
            </div>

            <div className="fav-card">
              <div className="tile-avatars">
                <span className="ava" />
              </div>
              <div className="tile-title">Design assets</div>
              <div className="tile-sub">76 files</div>
              <div className="tile-underline u-pink" />
            </div>

            <div className="fav-card">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Client handoffs</div>
              <div className="tile-sub">22 files</div>
              <div className="tile-underline u-purple" />
            </div>

            <div className="fav-card">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Media</div>
              <div className="tile-sub">41 files</div>
              <div className="tile-underline u-teal" />
            </div>

            <button className="fav-add" aria-label="New favorite group">+</button>
          </div> */}

          <h2 className="section-title">Recent Files</h2>

          <ul className="fav-list">
            <li className="fav-row">
              <div className="fav-left">
                <span className="fav-dot blue">★</span>
                <span className="fav-name">Quarterly-report-Q3.docx</span>
              </div>
              <div className="fav-owner">
                <span className="mini-ava" />
              </div>
              <div className="fav-meta">DOCx file</div>
              <div className="fav-meta">540 kb</div>
              <button className="fav-action" title="Share">⤴</button>
              <button className="fav-action" title="More">⋯</button>
            </li>

            <li className="fav-row">
              <div className="fav-left">
                <span className="fav-dot pink">★</span>
                <span className="fav-name">Brand-kit.png</span>
              </div>
              <div className="fav-owner">
                <span className="mini-ava" />
                <span className="mini-ava" />
              </div>
              <div className="fav-meta">PNG file</div>
              <div className="fav-meta">1.2 MB</div>
              <button className="fav-action" title="Share">⤴</button>
              <button className="fav-action" title="More">⋯</button>
            </li>

            <li className="fav-row">
              <div className="fav-left">
                <span className="fav-dot purple">★</span>
                <span className="fav-name">Kickoff-meeting.avi</span>
              </div>
              <div className="fav-owner">
                <span className="mini-ava" />
              </div>
              <div className="fav-meta">AVI file</div>
              <div className="fav-meta">38 MB</div>
              <button className="fav-action" title="Share">⤴</button>
              <button className="fav-action" title="More">⋯</button>
            </li>

            <li className="fav-row">
              <div className="fav-left">
                <span className="fav-dot blue">★</span>
                <span className="fav-name">Moodboard-49.png</span>
              </div>
              <div className="fav-owner">
                <span className="mini-ava" />
              </div>
              <div className="fav-meta">PNG file</div>
              <div className="fav-meta">2.1 MB</div>
              <button className="fav-action" title="Share">⤴</button>
              <button className="fav-action" title="More">⋯</button>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
