import { Routes, Route } from "react-router-dom";
import { Navbar } from './components/Navbar';
import { ListView } from './pages/ListView';
import { GalleryView } from './pages/GalleryView';
import { DetailView } from './pages/DetailView';


export const App = () => {
    return(
        <div>
            <Navbar />
             <Routes>
                <Route path="/" element={<ListView />} />
                <Route path="gallery" element={<GalleryView />} />
                <Route path="/pokemon/:id" element={<DetailView />} />
            </Routes>
        </div>
    );
};

export default App;



