import { FaPepperHot as icon } from 'react-icons/fa';

export default {
    name: 'topping',
    title: 'Toppings',
    type: 'document',
    icon,
    fields: [
        {
            name: 'name',
            title: 'Topping Name',
            type: 'string',
            description: 'Name of the topping'
        },
        {
            name: 'vegetarian',
            title: 'Vegetarian',
            type: 'boolean',
            description: 'Is the topping vegetarian?',
            options: {
                layout: 'checkbox'
            }
        }
    ],
    preview: {
        select: {
            name: 'name',
            vegetarian: 'vegetrian'
        },
        prepare: (fields) => ({
            title: `${fields.name}`
        })
    }
};