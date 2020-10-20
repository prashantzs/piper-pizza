import Path from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({graphql, actions}) {
    //Get template for this page
    const pizzaTemplate = Path.resolve('./src/templates/Pizza.js');

    //Query all Pizzas
    const { data } = await graphql(`
        query {
            pizzas: allSanityPizza {
                nodes {
                    name
                    slug {
                        current
                    }
                }
            }
        }
    `); 

    //Loop over each pizza and create page for each pizza
    data.pizzas.nodes.forEach(pizza => {
        actions.createPage({
            path: `pizza/${pizza.slug.current}`,
            component: pizzaTemplate,
            context: {
                slug: pizza.slug.current
            }
        })
    })
}

async function turnToppingsIntoPages({graphql, actions}) {
    //Get template for this page
    const toppingTemplate = Path.resolve('./src/pages/pizzas.js');

    //Query all Toppings
    const { data } = await graphql(`
        query {
            toppings: allSanityTopping {
                nodes {
                    name,
                    id
                }
            }
        }
    `); 

    //Create page for that topping
    data.toppings.nodes.forEach(topping => {
        actions.createPage({
            path: `topping/${topping.name}`,
            component: toppingTemplate,
            context: {
                topping: topping.name,
                toppingRegex: `/${topping.name}/i`
            }
        })
    })

    //Pass topping data to pizaa.js
}

export async function createPages(params) {
    //Create pages dynamically

    await Promise.all([
        turnPizzasIntoPages(params),
        turnToppingsIntoPages(params),
        turnSlicemastersIntoPages(params)
    ])

    //Pizzas
    //Toppings
    //Slicemasters

}

async function fetchBeersAndTurnIntoNodes({actions, createNodeId, createContentDigest}) {
    //fetch list of beers
    const res = await fetch('https://sampleapis.com/beers/api/ale');
    const beers = await res.json();

    //Loop over each one
    for (const beer of beers) {
        const nodeMeta = {
            id: createNodeId(`beer-${beer.name}`),
            parent: null,
            children: [],
            internal: {
                type: 'Beer',
                mediaType: 'application/json',
                contentDigest: createContentDigest(beer)
            }
        };
        //Create a nodes for that beer
        actions.createNode({
            ...beer,
            ...nodeMeta
        });
    }

}

async function turnSlicemastersIntoPages({graphql, actions}) {
    const slicemasterTemplate = Path.resolve('./src/templates/Slicemaster.js');

    // Query all slicemasters
    const { data } = await graphql(`
        query {
            slicemasters: allSanityPerson {
                totalCount
                nodes {
                    name,
                    id,
                    slug {
                        current
                    }
                }
            }
        }
    `);

    // Turn each slicemasters into their own page
    data.slicemasters.nodes.forEach(person => {
        actions.createPage({
            path: `slicemasters/${person.slug.current}`,
            component: slicemasterTemplate,
            context: {
                slug: person.slug.current
            }
        })
    })

    // Figure out how many pages there are based on number of slicemasters and number of them per page
    const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
    const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

    console.log(pageCount);

    Array.from({length: pageCount}).forEach((_, i) => {
        console.log(`Creating pages ${i}`);
        actions.createPage({
            path: `/slicemasters/${i + 1}`,
            component: Path.resolve('./src/pages/slicemasters.js'),
            context: {
                skip: i * pageSize,
                currentPage: i + 1,
                pageSize,
            }
        })
    })
}

export async function sourceNodes(params) {
    //Fetch list of beers and source them into gatsby API

    await Promise.all([fetchBeersAndTurnIntoNodes(params)])
}