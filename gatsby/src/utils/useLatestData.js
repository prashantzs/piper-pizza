import React, { useState, useEffect } from 'react';

const gql = String.raw;

const deets = gql`
    name
    _id,
    image {
        asset {
            url
            metadata {
                lqip
            }
        }
    }
`;

export default function useLatestData() {
    // hot slices
    const [hotSlices, setHotSlices] = useState();

    // slicemasters
    const [slicemasters, setSlicemasters] = useState();

    //use a side effect to fetch data from the graphql endpoint
    useEffect(function() {
        // when component loads, fetches the data
        fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query  {
                        StoreSettings(id: "downtown") {
                            name
                            slicemaster {
                                ${deets}
                            }
                            hotSlices {
                                ${deets}
                            }
                        }
                    }
                `
            })
        }).then(res => res.json()).then(res => {
            setHotSlices(res?.data?.StoreSettings?.hotSlices);
            setSlicemasters(res?.data?.StoreSettings?.slicemaster);
        })
    },[])
    return {
        hotSlices,
        slicemasters
    }
}