const localhost = '10.0.0.8:5000';
const shipping = 10;

const sortByPrice = (a, b) => {
    if (a.price > b.price)
        return 1;
    else
        if (b.price > a.price)
            return -1;
    return 0;
}

const dummyOrders = [{
    orderNumber: '111111113',
    date: new Date(2022, 6, 23),
    products: [{
        catalogNumber: "111112",
        name: "Thanos' Spaceship",
        amount: 1,
        sum: 179
    },
    {
        catalogNumber: "111111",
        name: "The Guardians ship",
        amount: 1,
        sum: 600
    }],
    sum: 779,
},
{
    orderNumber: '111111112',
    date: new Date(2022, 1, 3),
    products: [{
        catalogNumber: "111112",
        name: "Thanos' Spaceship",
        amount: 1,
        sum: 179
    },
    {
        catalogNumber: "111111",
        name: "The Guardians ship",
        amount: 1,
        sum: 600
    }],
    sum: 779,
},
{
    orderNumber: '111111111',
    date: new Date(2021, 5, 9),
    products: [{
        catalogNumber: "111112",
        name: "Thanos' Spaceship",
        amount: 1,
        sum: 179
    },
    {
        catalogNumber: "111111",
        name: "The Guardians ship",
        amount: 1,
        sum: 600
    }],
    sum: 779,
}
];

export { localhost, shipping, sortByPrice, dummyOrders };