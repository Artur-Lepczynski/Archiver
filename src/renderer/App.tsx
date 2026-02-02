import "./App.css";
import AboutModal from "./components/about/AboutModal";
import Main from "./components/Main";
import OpenNewFolderModal from "./components/openNewFolder/OpenNewFolderModal";

export default function App() {
  const isNewFolderModal = window.electron?.isNewFolderModal;
  const isAboutModal = window.electron?.isAboutModal;

  if (isNewFolderModal) return <OpenNewFolderModal />;
  if (isAboutModal) return <AboutModal />;

  return <Main />;
}
