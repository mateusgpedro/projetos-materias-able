import Sidebar from "../components/Sidebar";

function DefinicoesPage({ setIsLoggedIn }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={5}></Sidebar>
    </div>
  );
}

export default DefinicoesPage;
