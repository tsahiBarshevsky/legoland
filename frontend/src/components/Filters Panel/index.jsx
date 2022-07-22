import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Slider } from '@miblanchard/react-native-slider';
import update from 'immutability-helper';
import { useDispatch } from 'react-redux';
import { localhost, sortByPrice } from '../../utils/utilities';

const defaultAges = [1, 18];
const defaultPrices = [179, 1200];

const FilterPanel = ({ filterPanelRef }) => {
    const [brands, setBrands] = useState([]);
    const [ages, setAges] = useState(defaultAges);
    const [prices, setPrices] = useState(defaultPrices);
    const dispatch = useDispatch();

    const onBrandPressed = (brand) => {
        const index = brands.findIndex((e) => e === brand);
        if (index !== -1)
            setBrands(update(brands, { $splice: [[index, 1]] }));
        else
            setBrands(update(brands, { $push: [brand] }));
    }

    const onClearFilters = () => {
        fetch(`http://${localhost}/get-all-products`)
            .then(res => res.json())
            .then(res => dispatch({ type: 'SET_PRODUCTS', products: res.sort(sortByPrice) }))
            .catch(error => console.log(error.message))
            .finally(() => {
                setBrands([]);
                setAges(defaultAges);
                setPrices(defaultPrices);
                filterPanelRef.current?.close();
            });
    }

    const onApplyFilters = () => {
        fetch(`http://${localhost}/find-product-by-brand`,
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
                        <Text>Star Wars</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onBrandPressed('Marvel')}>
                        <Text>Marvel</Text>
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
                />
                <Text>{`${ages[0]} - ${ages[1]}`}</Text>
                <Text style={styles.title}>Price</Text>
                <Slider
                    value={prices}
                    onValueChange={(value) => setPrices(value)}
                    minimumValue={179}
                    maximumValue={1200}
                    step={1}
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