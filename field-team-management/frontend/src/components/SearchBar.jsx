import React, {
    useState,
    useRef,
    useEffect
} from "react";

import {
    FaSearch,
    FaSyncAlt,
    FaChevronDown,
    FaCheck
} from "react-icons/fa";

import "./SearchBar.css";


const SearchBar = ({
    search = "",
    setSearch,

    district = "",
    setDistrict,

    selectedBlocks = [],
    setSelectedBlocks,

    districts = [],
    blocks = [],

    onReset
}) => {

    const [blockDropdown, setBlockDropdown] =
        useState(false);

    const dropdownRef = useRef(null);


    // =====================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // =====================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setBlockDropdown(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =====================================================
    // DISTRICT CHANGE
    // =====================================================

    const handleDistrictChange = (e) => {

        const value = e.target.value;

        setDistrict(value);

        // Clear previous blocks
        setSelectedBlocks([]);

        // Close dropdown
        setBlockDropdown(false);

    };


    // =====================================================
    // BLOCK SELECT / DESELECT
    // =====================================================

    const handleBlockChange = (blockName) => {

        setSelectedBlocks((previousBlocks) => {

            const currentBlocks =
                Array.isArray(previousBlocks)
                    ? previousBlocks
                    : [];


            if (currentBlocks.includes(blockName)) {

                // Remove block

                return currentBlocks.filter(
                    block => block !== blockName
                );

            }


            // Add block

            return [
                ...currentBlocks,
                blockName
            ];

        });

    };


    // =====================================================
    // SELECT ALL / DESELECT ALL
    // =====================================================

    const handleSelectAll = (e) => {

        e.stopPropagation();

        if (!Array.isArray(blocks) || blocks.length === 0) {
            return;
        }


        if (
            selectedBlocks.length === blocks.length
        ) {

            setSelectedBlocks([]);

        } else {

            setSelectedBlocks([
                ...blocks
            ]);

        }

    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        setSearch("");

        setDistrict("");

        setSelectedBlocks([]);

        setBlockDropdown(false);

        if (onReset) {
            onReset();
        }

    };


    // =====================================================
    // ALL BLOCKS SELECTED
    // =====================================================

    const allBlocksSelected =
        Array.isArray(blocks) &&
        blocks.length > 0 &&
        selectedBlocks.length === blocks.length;


    // =====================================================
    // BLOCK BUTTON TEXT
    // =====================================================

    const getBlockButtonText = () => {

        if (
            !Array.isArray(selectedBlocks) ||
            selectedBlocks.length === 0
        ) {

            return "All Blocks";

        }


        if (
            blocks.length > 0 &&
            selectedBlocks.length === blocks.length
        ) {

            return "All Blocks";

        }


        if (selectedBlocks.length === 1) {

            return selectedBlocks[0];

        }


        return `${selectedBlocks.length} Blocks Selected`;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="search-panel">

            <div className="row g-3 align-items-end">


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="col-md-4">

                    <label className="form-label">
                        Search
                    </label>

                    <div className="input-group">

                        <span className="input-group-text">
                            <FaSearch />
                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="FE, AM, ZOM, contact..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* =================================================
                    DISTRICT
                ================================================= */}

                <div className="col-md-3">

                    <label className="form-label">
                        District
                    </label>

                    <select
                        className="form-select"
                        value={district}
                        onChange={handleDistrictChange}
                    >

                        <option value="">
                            All Districts
                        </option>

                        {Array.isArray(districts) &&
                            districts.map(
                                (item, index) => (

                                    <option
                                        key={`${item}-${index}`}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            )
                        }

                    </select>

                </div>


                {/* =================================================
                    MULTIPLE BLOCK SELECT
                ================================================= */}

                <div className="col-md-3">

                    <label className="form-label">
                        Block
                    </label>


                    <div
                        className="block-select-container"
                        ref={dropdownRef}
                    >


                        {/* =================================================
                            BLOCK BUTTON
                        ================================================= */}

                        <button
                            type="button"
                            className="block-select-button"
                            onClick={() =>
                                setBlockDropdown(
                                    previous => !previous
                                )
                            }
                        >

                            <span>
                                {getBlockButtonText()}
                            </span>

                            <FaChevronDown
                                size={12}
                            />

                        </button>


                        {/* =================================================
                            DROPDOWN
                        ================================================= */}

                        {blockDropdown && (

                            <div className="block-dropdown-menu">


                                {/* =========================================
                                    SELECT ALL
                                ========================================= */}

                                <div
                                    className="block-select-all"
                                    onClick={handleSelectAll}
                                >

                                    <span>

                                        {allBlocksSelected
                                            ? "Deselect All"
                                            : "Select All"
                                        }

                                    </span>


                                    {allBlocksSelected && (

                                        <FaCheck
                                            size={13}
                                        />

                                    )}

                                </div>


                                {/* =========================================
                                    NO BLOCKS
                                ========================================= */}

                                {blocks.length === 0 && (

                                    <div className="no-blocks">

                                        {district
                                            ? "No blocks found"
                                            : "Select a district first"
                                        }

                                    </div>

                                )}


                                {/* =========================================
                                    BLOCKS
                                ========================================= */}

                                {Array.isArray(blocks) &&
                                    blocks.map(
                                        (blockName, index) => {

                                            const isSelected =
                                                selectedBlocks.includes(
                                                    blockName
                                                );


                                            return (

                                                <div
                                                    key={`${blockName}-${index}`}
                                                    className={
                                                        `block-option ${
                                                            isSelected
                                                                ? "selected"
                                                                : ""
                                                        }`
                                                    }

                                                    onClick={() =>
                                                        handleBlockChange(
                                                            blockName
                                                        )
                                                    }
                                                >

                                                    <div className="block-left">

                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                isSelected
                                                            }

                                                            onChange={() =>
                                                                handleBlockChange(
                                                                    blockName
                                                                )
                                                            }

                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        />

                                                        <span>
                                                            {blockName}
                                                        </span>

                                                    </div>


                                                    {isSelected && (

                                                        <FaCheck
                                                            className="block-check"
                                                            size={12}
                                                        />

                                                    )}

                                                </div>

                                            );

                                        }
                                    )
                                }

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    RESET
                ================================================= */}

                <div className="col-md-2">

                    <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={handleReset}
                    >

                        <FaSyncAlt className="me-2" />

                        Reset

                    </button>

                </div>

            </div>


            {/* =====================================================
                SELECTED BLOCKS
            ===================================================== */}

            {selectedBlocks.length > 0 && (

                <div className="selected-blocks-info">

                    <strong>
                        Selected Blocks:
                    </strong>

                    <span>
                        {selectedBlocks.join(", ")}
                    </span>

                </div>

            )}

        </div>

    );

};


export default SearchBar;