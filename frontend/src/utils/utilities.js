const localhost = '10.0.0.5:5000';
const shipping = 10;
const brands = ['Star Wars', 'Marvel', 'Harry Potter', 'Icons', 'Architecture'];

const sortByPrice = (a, b) => {
    if (a.price > b.price)
        return 1;
    else
        if (b.price > a.price)
            return -1;
    return 0;
}

export { localhost, shipping, brands, sortByPrice };