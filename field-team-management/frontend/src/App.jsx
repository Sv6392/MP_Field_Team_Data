import React, { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import FieldTeams from "./pages/FieldTeams";
import ImportExport from "./components/ImportExport";


const App = () => {

    const [showImportExport, setShowImportExport] =
        useState(false);


    return (

        <div className="app">

            <Navbar />

            <div className="main-layout">

                <Sidebar
                    onImportExport={() =>
                        setShowImportExport(true)
                    }
                />


                <main className="main-content">

                    {showImportExport ? (

                        <ImportExport
                            onClose={() =>
                                setShowImportExport(false)
                            }
                        />

                    ) : (

                        <FieldTeams />

                    )}

                </main>

            </div>

        </div>

    );
};


export default App;