import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
 const [form, setForm] = useState({
    avatar: "",
    name: "",
    email: "",
    phone: "",
    title: "",       // NEW
    location: "",    // NEW
  });

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onAvatarChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setField("avatar", url);
  }

  function onSubmit(e) {
    e.preventDefault();
    alert("Saved");
  }



  
 return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <DashboardHeader />

        <section className="profile-simple-wrap">
          <h1 className="page-title">Profile</h1>

          <div className="profile-simple-card">
            <div className="ps-avatar-row">
              <div
                className="ps-avatar"
                style={{ backgroundImage: `url(${form.avatar})` }}
              />
              <label className="ps-btn primary">
                Change photo
                <input hidden type="file" accept="image/*" onChange={onAvatarChange} />
              </label>
            </div>

            <form className="ps-form" onSubmit={onSubmit}>
              <div className="ps-field">
                <label>Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="ps-grid-2">
                <div className="ps-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
                <div className="ps-field">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="ps-grid-2">
                <div className="ps-field">
                  <label>Address</label>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Street address, P.O. box, etc."
                  />
                </div>
                <div className="ps-field">
                  <label>Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="ps-actions">
                <button className="ps-btn primary" type="submit">Save changes</button>
                <button
                  className="ps-btn"
                  type="button"
                  onClick={() =>
                    setForm({ avatar: "", name: "", email: "", phone: "", title: "", location: "" })
                  }
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}