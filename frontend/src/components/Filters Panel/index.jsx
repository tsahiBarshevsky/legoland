import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Slider } from '@miblanchard/react-native-slider';
import update from 'immutability-helper';
import { useDispatch } from 'react-redux';
import { localhost, sortByPrice } from '../../utils/utilities';

const defaultAges = [1, 18];
const defaultPrices = [179, 1699];

const FilterPanel = ({ filterPanelRef }) => {
    const [brands, setBrands] = useState([]);
    const [ages, setAges] = useState(defaultAges);
    const [prices, setPrices] = useState(defaultPrices);
    const [brandsApply, setBrandsApply] = useState(false);
    const [agesApply, setAgesApply] = useState(false);
    const [pricesApply, setPricesApply] = useState(false);
    const dispatch = useDispatch();

    const onBrandPressed = (brand) => {
        const index = brands.findIndex((e) => e === brand);
        if (index !== -1)
            setBrands(update(brands, { $splice: [[index, 1]] }));
        else
            setBrands(update(brands, { $push: [brand] }));
    }

    const onSlidingComplete = (slider) => {
        if (slider === 'ages') {
            if (JSON.stringify(ages) === JSON.stringify(defaultAges))
                setAgesApply(false);
            else
                setAgesApply(true);
        }
        else {
            if (JSON.stringify(prices) === JSON.stringify(defaultPrices))
                setPricesApply(false);
            else
                setPricesApply(true);
        }
    }

    const onClearFilters = () => {
        fetch(`http://${localhost}/get-all-products`)
            .then(res => res.json())
            .then(res => dispatch({ type: 'SET_PRODUCTS', products: res.sort(sortByPrice) }))
            .catch(error => console.log(error.message))
            .finally(() => {
                setBrands([]);
                setBrandsApply(false);
                setAges(defaultAges);
                setAgesApply(false);
                setPrices(defaultPrices);
                setPricesApply(false);
                filterPanelRef.current?.close();
            });
    }

    const onApplyFilters = () => {
        var type = '';
        switch (true) {
            // #1 - TTT
            case (brandsApply && agesApply && pricesApply):
                type = 'brands-ages-prices';
                break;
            // #2 - TTF
            case (brandsApply && agesApply && !pricesApply):
                type = 'brands-ages';
                break;
            // #3 - TFT
            case (brandsApply && !agesApply && pricesApply):
                type = 'brands-prices';
                break;
            // #4 - TFF
            case (brandsApply && !agesApply && !pricesApply):
                type = 'brands';
                break;
            // #5 - FTT
            case (!brandsApply && agesApply && pricesApply):
                type = 'ages-prices';
                break;
            // #6 - FTF
            case (!brandsApply && agesApply && !pricesApply):
                type = 'ages';
                break;
            // #7 - FFT
            case (!brandsApply && !agesApply && pricesApply):
                type = 'prices';
                break;
            // #8 - FFF (handle inside render)
            default:
                type = 'none';
                break;
        }
        if (type === 'none')
            fetch(`http://${localhost}/get-all-products`)
                .then(res => res.json())
                .then(res => dispatch({ type: 'SET_PRODUCTS', products: res.sort(sortByPrice) }))
                .catch(error => console.log(error.message))
                .finally(() => {
                    filterPanelRef.current?.close();
                });
        else
            fetch(`http://${localhost}/filter-products?type=${type}`,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        brands: brands,
                        ages: ages,
                        prices: prices
                    })
                })
                .then(res => res.json())
                .then(res => dispatch({ type: 'SET_PRODUCTS', products: res }))
                .catch(error => console.log(error.message))
                .finally(() => filterPanelRef.current?.close());
    }

    useEffect(() => {
        if (brands.length === 0)
            setBrandsApply(false);
        else
            setBrandsApply(true);
    }, [brands]);

    return (
        <Modalize
            ref={filterPanelRef}
            threshold={50}
            adjustToContentHeight
            handlePosition='inside'
            modalStyle={styles.modalStyle}
            handleStyle={styles.handleStyle}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <Text style={styles.title}>Brand</Text>
                <View style={styles.brands}>
                    <TouchableOpacity onPress={() => onBrandPressed('Star Wars')}>
                        <Text style={brands.findIndex((e) => e === 'Star Wars') !== -1 ? { color: 'red' } : { color: 'black' }}>Star Wars</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onBrandPressed('Marvel')}>
                        <Text style={brands.findIndex((e) => e === 'Marvel') !== -1 ? { color: 'red' } : { color: 'black' }}>Marvel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onBrandPressed('Harry Potter')}>
                        <Text style={brands.findIndex((e) => e === 'Harry Potter') !== -1 ? { color: 'red' } : { color: 'black' }}>Harry Potter</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>Ages</Text>
                <Slider
                    value={ages}
                    onValueChange={(value) => setAges(value)}
                    minimumValue={1}
                    maximumValue={18}
                    step={1}
                    trackMarks={[5, 10, 15]}
                    renderTrackMarkComponent={() => <View style={styles.mark} />}
                    onSlidingComplete={() => onSlidingComplete('ages')}
                />
                <Text>{`${ages[0]} - ${ages[1]}`}</Text>
                <Text style={styles.title}>Price</Text>
                <Slider
                    value={prices}
                    onValueChange={(value) => setPrices(value)}
                    minimumValue={179}
                    maximumValue={1699}
                    step={1}
                    onSlidingComplete={() => onSlidingComplete('prices')}
                />
                <Text>{`${prices[0]} - ${prices[1]}`}</Text>
                <TouchableOpacity onPress={onApplyFilters}>
                    <Text>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClearFilters}>
                    <Text>Clear</Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    )
}

export default FilterPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingTop: 25,
        paddingBottom: 15,
        paddingHorizontal: 15
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17
    },
    brands: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    mark: {
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: 'blue'
    }
});