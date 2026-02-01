import "./App.css";
import Main from "./components/Main";
import OpenNewFolderModal from "./components/openNewFolder/OpenNewFolderModal";

export default function App() {
  const isNewFolderModal = window.electron?.isNewFolderModal;

  if (isNewFolderModal) return <OpenNewFolderModal />;

  return <Main />;
}
