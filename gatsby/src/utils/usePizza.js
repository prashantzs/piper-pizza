import React, { useState, useContext } from 'react';
import OrderContext from '../components/OrderContext';
import calculateOrderTotal from './calculateOrderTotal';
import attachNamesAndPrices from './attachNamesAndPrices';
import formatMoney from './formatMoney';

export default function usePizza({pizzas, values}) {
    //Create some state to hold order
    //We commneted this code out since we moved up the state to OrderContext
    //const [order, setOrder] = useState([]);

    const [order, setOrder] = useContext(OrderContext);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    //Make a function to add things to order
    function addToOrder(orderedPizza) {
        setOrder([...order, orderedPizza]);
    }

    //Make a function to remove things from order
    function removeFromOrder(index) {
        setOrder([
            ...order.slice(0, index),
            ...order.slice(index + 1)
        ]);
    }
    
    //Function runs whenever user submits the form
    async function submitOrder(e) {
        e.preventDefault();
        console.log(e);
        setLoading(true);
        setError(null);
        //setMessage(null);

        const body = {
            order: attachNamesAndPrices(order, pizzas),
            total: formatMoney(calculateOrderTotal(order, pizzas)),
            name: values.name,
            email: values.email,
            mapleSyrup: values.mapleSyrup
        };

        //Send this data to serverless function when checkout
        const res = await fetch(`${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const text = JSON.parse(await res.text());

        //Check if everything worked
        if(res.status >= 400 && res.status < 600) {
            setLoading(false);
            setError(text.message);
        } else {
            setLoading(false);
            setMessage('Success!');
        }
    }

    return {
        order,
        addToOrder,
        removeFromOrder,
        error,
        loading,
        message,
        submitOrder
    };
}