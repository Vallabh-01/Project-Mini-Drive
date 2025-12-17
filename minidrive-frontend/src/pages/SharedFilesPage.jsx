import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/SharedFilesPage.css";

export default function SharedFilesPage() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <DashboardHeader />

        <section className="shared-wrap">
          <h1 className="page-title">Your shared files</h1>

          <div className="shared-cards-row">
            <div className="shared-card-tile">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Keynote files</div>
              <div className="tile-sub">820 files</div>
              <div className="tile-underline u-blue" />
            </div>

            <div className="shared-card-tile">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Vacation photos</div>
              <div className="tile-sub">115 files</div>
              <div className="tile-underline u-pink" />
            </div>

            <div className="shared-card-tile">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Project report</div>
              <div className="tile-sub">65 files</div>
              <div className="tile-underline u-purple" />
            </div>

            <div className="shared-card-tile">
              <div className="tile-avatars">
                <span className="ava" />
                <span className="ava" />
                <span className="ava" />
              </div>
              <div className="tile-title">Memes</div>
              <div className="tile-sub">21 files</div>
              <div className="tile-underline u-teal" />
            </div>

            <button className="shared-card-add" aria-label="Add">
              +
            </button>
          </div>

          <h2 className="section-title">Shared recently</h2>

          <ul className="recent-list shared-recent">
            <li className="recent-row">
              <div className="recent-left">
                <span className="recent-dot blue" />
                <span className="recent-name">Keynote data</span>
              </div>
              <div className="recent-owners">
                <span className="mini-ava" />
                <span className="mini-ava" />
              </div>
              <div className="recent-meta">DOCx file</div>
              <div className="recent-meta">500 kb</div>
              <button className="recent-share" title="Share">⤴</button>
              <button className="recent-more" title="More">⋯</button>
            </li>

            <li className="recent-row">
              <div className="recent-left">
                <span className="recent-dot pink" />
                <span className="recent-name">IMG_Vacation_10</span>
              </div>
              <div className="recent-owners">
                <span className="mini-ava" />
              </div>
              <div className="recent-meta">PNG file</div>
              <div className="recent-meta">1 MB</div>
              <button className="recent-share" title="Share">⤴</button>
              <button className="recent-more" title="More">⋯</button>
            </li>

            <li className="recent-row">
              <div className="recent-left">
                <span className="recent-dot pink" />
                <span className="recent-name">Reel-video-vacay</span>
              </div>
              <div className="recent-owners">
                <span className="mini-ava" />
              </div>
              <div className="recent-meta">AVI file</div>
              <div className="recent-meta">44 MB</div>
              <button className="recent-share" title="Share">⤴</button>
              <button className="recent-more" title="More">⋯</button>
            </li>

            <li className="recent-row">
              <div className="recent-left">
                <span className="recent-dot blue" />
                <span className="recent-name">Meme-49</span>
              </div>
              <div className="recent-owners">
                <span className="mini-ava" />
              </div>
              <div className="recent-meta">PNG file</div>
              <div className="recent-meta">2 MB</div>
              <button className="recent-share" title="Share">⤴</button>
              <button className="recent-more" title="More">⋯</button>
            </li>

            <li className="recent-row">
              <div className="recent-left">
                <span className="recent-dot purple" />
                <span className="recent-name">Project proposal</span>
              </div>
              <div className="recent-owners">
                <span className="mini-ava" />
                <span className="mini-ava" />
              </div>
              <div className="recent-meta">DOCx file</div>
              <div className="recent-meta">450 kb</div>
              <button className="recent-share" title="Share">⤴</button>
              <button className="recent-more" title="More">⋯</button>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
