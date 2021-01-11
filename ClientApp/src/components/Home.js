import React, { Component, useEffect, useState }  from 'react';
import {Button} from "reactstrap";
import * as signalR from "@microsoft/signalr";
import { getRandomName }  from '../helpers/names';

export const Home = () => {
    const [connection, setConnection] = useState();
    const [userName, setUserName] = useState(getRandomName());
    const [currentTotal, setCurrentTotal] = useState(0);
    const [lastSlamValue, setLastSlamValue] = useState(0);
    const [lastSlammer, setLastSlammer] = useState('None');
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        
        if(!connection?.connectionStarted){
            console.log("Setting up connection");
            
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl('/SlamSession')
                .withAutomaticReconnect()
                .build();

            newConnection.on('Slammed', (amount, by) => {
                setHistory((prevState) => [...prevState, `${by} slammed additional ${amount}`]);
                setCurrentTotal((prevState) => prevState + amount);
                setLastSlammer(by);
                setLastSlamValue(amount);
            });
            
            setConnection(newConnection);   
        }
        
    }, []);

    useEffect(() => {
        if(connection && !connection.connectionStarted)
        {
            console.log("Starting connection");

            connection
                .start()
                .then(res => setHistory([...history, 'Connection established.']));
        }
    }, [connection])
    
    const slam = async () => {
        if(connection && connection.connectionStarted){
            try {
                await connection.send('Slam', userName);
            }catch(e) {
                console.log("Error when slamming", e);
            }
        }
    }
    
    const getHistory = () => {
        let historyItems = [];
        for(let i = 0; i < history.length; ++i){
            historyItems.push(<li key={i}>{history[i]}</li>);
        }
        
        return historyItems;
    }
    
    return (
        <div>
            <h1>Welcome, Slammer!</h1>
            <p>Get ready to slam against your peers:</p>

            <ul>
                <li>Last slam was made by {lastSlammer} with {lastSlamValue} points</li>
                <li>Current Totalt: {currentTotal}</li>
            </ul>
            <Button onClick={slam}>Slam</Button>

            <h3>History</h3>
            <ul>
                {getHistory()}
            </ul>
        </div>
    );
};
