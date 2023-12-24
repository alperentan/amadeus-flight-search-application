import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import FlightList from './FlightList';

const FlightSearchForm = () => {
    const [departureAirport, setDepartureAirport] = useState(null);
    const [arrivalAirport, setArrivalAirport] = useState(null);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [oneWay, setOneWay] = useState(false);
    const [arrivalFlightData, setArrivalFlightData] = useState([]);
    const [returnFlightData, setReturnFlightData] = useState([]);
    const [showFlightList, setShowFlightList] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [oneWayClicked, setOneWayClicked] = useState(false); // to store oneway clicked value when pressing search button

    const today = new Date().toLocaleDateString('tr-TR').split('.').reverse().join('-'); // Get today's date in YYYY-MM-DD format

    // Fetch the list of airports from the API to use in the select input
    useEffect(() => {
        fetch('http://localhost:3001/airports')
            .then(response => response.json())
            .then(data => {
                const options = data.map(airport => ({
                    value: airport.code,
                    label: airport.name + ' , ' + airport.city,
                }));
                setOptions(options);
            })
            .catch(error => {
                console.error(error);
                setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            });
    }, []);

    // Handle the form submit event
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowFlightList(false); // Hide flight list if previously shown
        setError(''); // Clear error message if previously shown
        setLoading(true); // Set loading status to true while API request is being sent
        
        // Check if the departure airport and arrival airport are the same
        if (departureAirport.value === arrivalAirport.value) {
            setError('Kalkış havaalanı ile varış havaalanı aynı olamaz.');
            setLoading(false); // Set loading status to false after error
            return;
        }

        // Check if one-way flight is selected and set when form is submitted
        if(oneWay===true){
            setOneWayClicked(true);
        }
        else{
            setOneWayClicked(false);
        }

        // Create the payload for the API request
        const payload = {
            departureAirport,
            arrivalAirport,
            departureDate,
            returnDate,
            oneWay
        };

        // Send the API request using the payload
        const departureUrl = `http://localhost:3001/flights?departureAirportCode=${payload.departureAirport.value}&arrivalAirportCode=${payload.arrivalAirport.value}&departureDate=${payload.departureDate}`;
        fetch(departureUrl)
            .then(response => response.json())
            .then(data => {
                // Handle the API response data
                setArrivalFlightData(data);
                setShowFlightList(true);
                setLoading(false); // Set loading status to false after API response
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
                setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                setLoading(false); // Set loading status to false after error
            });
        // get return flight data if one-way is not checked
        if(oneWay===false){
            const returnUrl = `http://localhost:3001/flights?departureAirportCode=${payload.arrivalAirport.value}&arrivalAirportCode=${payload.departureAirport.value}&departureDate=${payload.returnDate}`;
            fetch(returnUrl)
                .then(response => response.json())
                .then(data => {
                    // Handle the API response data
                    setReturnFlightData(data);
                    setShowFlightList(true);
                    setLoading(false); // Set loading status to false after API response
                })
                .catch(error => {
                    // Handle any errors
                    console.error(error);
                    setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                    setLoading(false); // Set loading status to false after error
                });
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className='selectDateInputSection'>
                <label className='airportSelect text-center'>
                    <b>Kalkış Havaalanı:</b>
                    <Select
                        options={options}
                        value={departureAirport}
                        onChange={setDepartureAirport}
                        isClearable={true} // Make the select input clearable
                        placeholder="Kalkış havaalanı"
                        noOptionsMessage={() => 'Havaalanı bulunamadı'} // Change the noOptionsMessage
                        required
                    />
                </label>
                <label className='airportSelect text-center'>
                    <b>Varış Havaalanı:</b>
                    <Select
                        options={options}
                        value={arrivalAirport}
                        onChange={setArrivalAirport}
                        isClearable={true} // Make the select input clearable
                        placeholder="Varış havaalanı"
                        noOptionsMessage={() => 'Havaalanı bulunamadı'} // Change the noOptionsMessage
                        required
                    />
                </label>
                <label className='dateSelect text-center'>
                Kalkış Tarihi:
                    <div>
                    <input
                        type="date"
                        className='dateInput'
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        min={today} // Set the minimum date to today's date
                        required
                    />
                    </div>
                </label>
                {
                    // Show the return date input if one-way is not checked
                    !oneWay && (
                    <label className='dateSelect text-center'>
                        Dönüş Tarihi:
                        <div>
                        <input
                            type="date"
                            className='dateInput'
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={departureDate} // Set the minimum date to departure date
                            required={!oneWay}
                        />
                        </div>
                    </label>
                )}
                </div>
                <div className='oneWayFlightCheckSection'>
                <label className='oneWayFlightCheck'>
                    Tek Yönlü Uçuş:
                    <input
                        type="checkbox"
                        className='checkInput'
                        checked={oneWay}
                        onChange={(e) => setOneWay(e.target.checked)}
                    />
                </label>
                </div>
                <div className='searchButtonSection'>
                <button type="submit" className='button search'>Ara</button>
            </div>
        </form>
        <div className='flightListSection'>
            <div>
                {loading && <div className="lds-dual-ring"></div>} {/* Render loading animation if loading is true */}
                {error && <p>{error}</p>}
                {showFlightList && <FlightList data={arrivalFlightData} title="Gidiş"/>}
                {showFlightList && !oneWayClicked && <FlightList data={returnFlightData} title="Dönüş"/>}
            </div>
        </div>
        </>
    );
};

export default FlightSearchForm;