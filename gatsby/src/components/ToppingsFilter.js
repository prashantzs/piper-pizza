import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';

const ToppingsStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 4rem;

    a {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 0 1rem;
        align-items: center;
        padding: 5px;
        background: var(--grey);
        border-radius: 2px;

        .count {
            background: white;
            padding: 2px 5px;
        }

        &[aria-current='page'] {
            background: var(--yellow);
        }
    }
`;

function countPizzasInToppings(pizzas) {
    const toppingsCount =  pizzas
        .map(pizza => pizza.toppings)
        .flat()
        .reduce((acc, topping) => {
          //Check if existing topping
          const existingTopping = acc[topping.id];

          if (existingTopping) {
            //if it is increment by 1
            existingTopping.count += 1;
          } else {
            //Otherwise create a new entry in our acc and set it to one
            acc[topping.id] = {
                id: topping.id,
                name: topping.name,
                count: 1
            };
          }
          return acc;
    }, {});

    const sortedToppings = Object.values(toppingsCount).sort((a,b) => b.count - a.count);
    return sortedToppings;
}

export default function ToppingsFilter({activeTopping}) {

    //Get a list of all toppings
    const {toppings, pizzas} = useStaticQuery(graphql`
        query {
            toppings: allSanityTopping {
                nodes {
                    name
                    vegetarian
                    id
                }
            }
            pizzas: allSanityPizza {
                nodes {
                    toppings {
                        name,
                        id
                    }
                }
            }
        }
    `);

    //Get a list of all pizzas with their toppings

    //Count how many pizzas are in each topping
    const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);

    //Loop over the list of toppings and display the toppings and the count of pizzas in that topping
    
    //Link it up


    return (
        <ToppingsStyled>
            <Link to="/pizzas">
                <span className="name">All</span>
                <span className="count">{pizzas.nodes.length}</span>
            </Link>
            {
                toppingsWithCounts.map(topping => (
                    <Link to={`/topping/${topping.name}`} key={topping.id} className={topping.name === activeTopping ? 'active' : ''}>
                        <span className="name">{topping.name}</span>
                        <span className="count">{topping.count}</span>
                    </Link>
                ))
            }
        </ToppingsStyled>
    )
}