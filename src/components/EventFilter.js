import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Importing default rc-slider styles
import '../styles.css'; // Assuming you have a custom stylesheet

function EventFilter({ onFilterChange }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [minTime, setMinTime] = useState('');
    const [maxTime, setMaxTime] = useState('');
    const [priceRange, setPriceRange] = useState([0, 500]); // Min/Max price range

    const handleFilterChange = () => {
        const filters = {
            search,
            category,
            minDate,
            maxDate,
            minTime,
            maxTime,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        };
        onFilterChange(filters);
    };

    // Function to trigger filtering when the Search button is clicked
    const handleSearchClick = () => {
        const filters = {
            search,
            category,
            minDate,
            maxDate,
            minTime,
            maxTime,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        };
        onFilterChange(filters); // Pass the filters up to the parent component
    };

    // Function to reset all filters to their default values when Clear button is clicked
    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setMinDate('');
        setMaxDate('');
        setMinTime('');
        setMaxTime('');
        setPriceRange([0, 500]);
        onFilterChange({ // Send empty or default filters to parent
            search: '',
            category: '',
            minDate: '',
            maxDate: '',
            minTime: '',
            maxTime: '',
            minPrice: 0,
            maxPrice: 500,
        });
    };

    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents form submission or page refresh
            handleFilterChange();
        }
    };

    return (
        <div className="event-filter">
            <div className="filter-group">
                <label>Search</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown} // Trigger search on "Enter"
                />
            </div>

            <div className="filter-group">
                <label>Category</label>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                    }}
                >
                    <option value="">All Categories</option>
                    <option value="Musical">Musical</option>
                    <option value="Play">Play</option>
                    <option value="Opera">Opera</option>
                    <option value="Ballet">Ballet</option>
                    <option value="Concert">Concert</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Min. Date</label>
                <input
                    type="date"
                    value={minDate}
                    onChange={(e) => {
                        setMinDate(e.target.value);
                    }}
                />
            </div>

            <div className="filter-group">
                <label>Max. Date</label>
                <input
                    type="date"
                    value={maxDate}
                    onChange={(e) => {
                        setMaxDate(e.target.value);
                    }}
                />
            </div>

            <div className="filter-group">
                <label>Min. Time</label>
                <input
                    type="time"
                    value={minTime}
                    onChange={(e) => {
                        setMinTime(e.target.value);
                    }}
                />
            </div>

            <div className="filter-group">
                <label>Max. Time</label>
                <input
                    type="time"
                    value={maxTime}
                    onChange={(e) => {
                        setMaxTime(e.target.value);
                    }}
                />
            </div>

            <div className="filter-group">
                <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <div className="price-slider">
                    <Slider
                        range
                        min={0}
                        max={500} // Adjust max price range here
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        trackStyle={[{ backgroundColor: 'black', height: 10 }]} // Track color
                        handleStyle={[
                            { borderColor: 'black', height: 20, width: 20, marginTop: -5 },
                            { borderColor: 'black', height: 20, width: 20, marginTop: -5 },
                        ]} // Handle color and size
                        railStyle={{ backgroundColor: 'gray', height: 10 }} // Rail color
                    />
                </div>
            </div>

            {/* Search and Clear Buttons */}
            <div className="filter-buttons">
                <button onClick={handleSearchClick}>Search</button> {/* Search Button */}
                <button onClick={handleClearFilters}>Clear</button> {/* Clear Button */}
            </div>
        </div>
    );
}

export default EventFilter;