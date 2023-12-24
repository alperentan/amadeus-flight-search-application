import React, { useState } from 'react';

const FlightList = ({ data, title }) => {
    const [sortBy, setSortBy] = useState(null);

    /**
     * Handles the sorting of flight data based on the selected key.
     * If the selected key is already the sorting key, it resets the sorting.
     * @param {string} key - The key to sort the flight data by.
     */
    const handleSort = (key) => {
        if (sortBy === key) {
            setSortBy(null);
        } else {
            setSortBy(key);
        }
    };

    
    // Sort the flight data based on the selected key
    const sortedData = sortBy ? [...data].sort((a, b) => {
        const aValue = a[sortBy].split(':').map(Number);
        const bValue = b[sortBy].split(':').map(Number);
        for (let i = 0; i < aValue.length; i++) {
            if (aValue[i] < bValue[i]) return -1;
            if (aValue[i] > bValue[i]) return 1;
        }
        return 0;
    }) : data;

    return (
        <>
            <h4 className='text-center'>{title}</h4>
            {sortedData.length === 0 ? (
                <p className='text-center'>Uçuş bulunamadı.</p>
            ) : (
                <>
                <div className='flex-display button-section'>
                <button className='button' onClick={() => handleSort('departureTime')}>Kalkış saatine göre sırala</button>
                <button className='button' onClick={() => handleSort('arrivalTime')}>Varış saatine göre sırala</button>
                <button className='button' onClick={() => handleSort('flightLength')}>Uçuş uzunluğuna göre sırala</button>
                <button className='button' onClick={() => handleSort('price')}>Fiyata göre sırala</button>
            </div>
                <ul>
                    {sortedData.map((flight) => (
                        <li key={flight.id} className='flightInfo'>
                            <p className='text-center'><b> {flight.airline}</b></p>
                            <div className='infoRow'>
                                <p><b>Kalkış Şehri:</b> {flight.departureCity}</p>
                                <p><b>Kalkış Havalimanı:</b> {flight.departureAirport}</p>
                                <p><b>Kalkış Tarihi:</b> {flight.departureDate.split('-').reverse().join('/')} {flight.departureTime}</p>
                            </div>
                            <div className='infoRow'>
                                <p><b>Varış Şehri:</b> {flight.arrivalCity}</p>
                                <p><b>Varış Havalimanı:</b> {flight.arrivalAirport}</p>
                                <p><b>Varış Tarihi:</b> {flight.arrivalDate.split('-').reverse().join('/')} {flight.arrivalTime}</p>
                            </div>
                            <div className='infoRow'>
                                <p><b>Uçuş Uzunluğu:</b> {flight.flightLength} saat</p>
                                <p><b>Fiyat:</b> {flight.price} TL</p>
                            </div>
                        </li>
                    ))}
                </ul>
                </>
            )}
        </>
    );
};

export default FlightList;