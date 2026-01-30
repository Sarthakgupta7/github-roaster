// import { Routes, Route, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// import Login from "./pages/Login";
// import Roast from "./pages/Roast";
// import Explain from "./pages/Explain";
// import Navbar from "./components/Navbar";

// function App() {
//   const [user, setUser] = useState(null);

//   // Hydrate user (OAuth OR localStorage)
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const userParam = params.get("user");

//     if (userParam) {
//       const parsed = JSON.parse(decodeURIComponent(userParam));
//       localStorage.setItem("user", JSON.stringify(parsed));
//       setUser(parsed);
//       window.history.replaceState({}, "", "/roast");
//       return;
//     }

//     const stored = localStorage.getItem("user");
//     if (stored) setUser(JSON.parse(stored));
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <>
//       {user && <Navbar user={user} onLogout={logout} />}

//       <Routes>
//         <Route path="/" element={user ? <Navigate to="/roast" /> : <Login />} />
//         <Route path="/roast" element={user ? <Roast user={user} /> : <Navigate to="/" />} />
//         <Route path="/explain" element={user ? <Explain user={user} /> : <Navigate to="/" />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

// import { Routes, Route, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// import Login from "./pages/Login";
// import Roast from "./pages/Roast";
// import Explain from "./pages/Explain";
// import Profile from "./pages/Profile";
// import Navbar from "./components/Navbar";
// import Compare from "./pages/Compare";

// function App() {
//   const [user, setUser] = useState(null);

//   // Hydrate user (OAuth OR localStorage)
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const userParam = params.get("user");

//     if (userParam) {
//       const parsed = JSON.parse(decodeURIComponent(userParam));
//       localStorage.setItem("user", JSON.stringify(parsed));
//       setUser(parsed);
//       window.history.replaceState({}, "", "/roast");
//       return;
//     }

//     const stored = localStorage.getItem("user");
//     if (stored) setUser(JSON.parse(stored));
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <>
//       {user && <Navbar user={user} onLogout={logout} />}

//       <Routes>
//         <Route path="/" element={user ? <Navigate to="/roast" /> : <Login />} />
//         <Route path="/roast" element={user ? <Roast user={user} /> : <Navigate to="/" />} />
//         <Route path="/explain" element={user ? <Explain user={user} /> : <Navigate to="/" />} />
//         <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
//         <Route path="/compare" element={user ? <Compare /> : <Navigate to="/" />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Roast from "./pages/Roast";
import Explain from "./pages/Explain";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Hydrate user (OAuth OR localStorage)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (userParam) {
      const parsed = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem("user", JSON.stringify(parsed));
      setUser(parsed);
      window.history.replaceState({}, "", "/roast");
      return;
    }

    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 Background variant by route
  const getVariant = () => {
    if (location.pathname.startsWith("/roast")) return "roast";
    if (location.pathname.startsWith("/explain")) return "explain";
    if (location.pathname.startsWith("/compare")) return "compare";
    if (location.pathname.startsWith("/profile")) return "profile";
    return "default";
  };

  return (
    <>
      {/* ✅ BACKGROUND LIVES HERE */}
      <AnimatedBackground variant={getVariant()} />

      {user && <Navbar user={user} onLogout={logout} />}

      {/* ✅ CONTENT LAYER */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/roast" /> : <Login />} />
          <Route path="/roast" element={user ? <Roast user={user} /> : <Navigate to="/" />} />
          <Route path="/explain" element={user ? <Explain user={user} /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
          <Route path="/compare" element={user ? <Compare /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
