import "./App.css";
import Main from "./components/Main";
import AboutModal from "./components/windows/about/AboutModal";
import OpenNewFolderModal from "./components/windows/openNewFolder/OpenNewFolderModal";

export default function App() {
  const isNewFolderModal = window.electron?.isNewFolderModal;
  const isAboutModal = window.electron?.isAboutModal;

  if (isNewFolderModal) return <OpenNewFolderModal />;
  if (isAboutModal) return <AboutModal />;

  return <Main />;
}
