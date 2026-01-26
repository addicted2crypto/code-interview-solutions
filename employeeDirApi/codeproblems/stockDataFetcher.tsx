// Build a react component that allows users to search for stock data by Date. When the user enters 
// a date and clicks "search", fetch data from the mock api and dispay the stock data for that date. 

// api endpoint: https://mock.com/api/stocks?date={date}

// api format:
// {
//     "data": [
//         {
//             "date" : "5-january-2000",
//             "open" : 5269.09,
//             "close" : 5324.15,
//             "high" : 5340.65,
//             "low" : 5250.00,
//         }
//     ]
// }

//thoughts: dates are d-mmmm-yyyy
//   search button will trigger api
//   display stock data(open, high, low, close) when found
//   display no results when data array is empty
//   initally no res nor not data should be shown -> state change watch me

// input: app-input
// search button: submit-button
// stock data list: stock-data
// no results message: no-results

// inital state: nothing searched dont show anything or not resizeBy
// success data show the stock data in a <ul>
// success with no data no res found

import React, { useState } from 'react';


//types stockdata and api response
interface StockData {
    data: string;
    open: number;
    close: number;
    high: number;
    low: number;
}

interface stockApiResposnse {
    page: number;
    date: string;
    per_page: number;
    total: number;
    total_pages: number;
    data: StockData[];
}

//constraints

const API_BASE_URL = 'https://mock.com/api/stocks';

//helper functions

const fetchStockData = async (date: string): Promise<StockData | null> => {
const url = `${API_BASE_URL}?date=${encodeURIComponent(date)}`;

const response = await fetch(`url`);

if(!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
}

const json: stockApiResposnse = await response.json();

return json.data.length > 0 ? json.data[0] : null;
}
//state

const StockDataFetcher: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const showStockData: boolean = hasSearched && stockData !== null && !isLoading;
    const showResults: boolean = hasSearched && stockData === null && !isLoading;
    const showLoading: boolean = isLoading;
    const showError: boolean = error !== null && !isLoading;



//event time 

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
};

const handleSearch = async (): Promise<void> => {
    const trimmedInput = inputValue.trim();
    if(!trimmedInput) {
        return;
    }       
    //reset state 

    setIsLoading(true);
    setHasSearched(true);
    setStockData(null);
    setError(null);

    try {
        const data = await fetchStockData(trimmedInput);
        setStockData(data);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'A unexpected error occurred';
    } finally {
        setIsLoading(false);
    }   

};

//render the stuff

return (
    <div className='stock-data-fetcher'>
        <div className='search-controls'>
            <input
                type='text'
                data-testid='app-input'
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Enter a date(ex 5-january-2000)'
            />
            <button data-testid='submit-button' onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
            
        </div>
        {showLoading && (
            <div className='loadin'>Loading...</div>
        )}
        {showError && ( 
            <div className='error' data-testid='error'>
                {error}  

            </div>
        )}
        {showStockData && stockData && (
            <ul data-testid='stock-data' className='stock-data'>
                <li>Open: {stockData.open}</li>
                <li>High: {stockData.high}</li>
                <li>Low: {stockData.low}</li>
                <li>Close: {stockData.close}</li>
            </ul>
        )}
        {showResults && (
            <div data-testId= 'no-results'>No results found</div>
        )}
    </div>
)
};
