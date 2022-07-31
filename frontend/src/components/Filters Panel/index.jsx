import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Slider } from '@miblanchard/react-native-slider';
import update from 'immutability-helper';
import { useDispatch } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeManager';
import { localhost, sortByPrice } from '../../utils/utilities';
import { lightMode, darkMode } from '../../utils/themes';
import { brands as brandsList } from '../../utils/utilities';

const defaultAges = [1, 18];
const defaultPrices = [179, 1715];

const FilterPanel = ({ filterPanelRef }) => {
    const { theme } = useContext(ThemeContext);
    const [filters, setFilters] = useState(0);
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
                setFilters(0);
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
            // #8 - FFF
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

    const isInBrands = (brand) => {
        return brands.findIndex((e) => e === brand) !== -1;
    }

    useEffect(() => {
        if (brands.length === 0)
            setBrandsApply(false);
        else
            setBrandsApply(true);
    }, [brands]);

    useEffect(() => {
        switch (true) {
            case (brandsApply && agesApply && pricesApply):
                setFilters(3);
                break;
            case (brandsApply && agesApply && !pricesApply):
                setFilters(2);
                break;
            case (brandsApply && !agesApply && pricesApply):
                setFilters(2);
                break;
            case (brandsApply && !agesApply && !pricesApply):
                setFilters(1);
                break;
            case (!brandsApply && agesApply && pricesApply):
                setFilters(2);
                break;
            case (!brandsApply && agesApply && !pricesApply):
                setFilters(1);
                break;
            case (!brandsApply && !agesApply && pricesApply):
                setFilters(1);
                break;
            default:
                setFilters(0);
                break;
        }
    }, [brandsApply, agesApply, pricesApply]);

    return (
        <Modalize
            ref={filterPanelRef}
            threshold={50}
            withHandle={false}
            adjustToContentHeight
            handlePosition='inside'
            modalStyle={[styles.modalStyle, styles[`modalBackground${theme}`]]}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <Text style={[styles.title, styles[`text${theme}`]]}>Brand</Text>
                <View style={styles.brands}>
                    {brandsList.map((brand) => {
                        return (
                            <View key={brand}>
                                <TouchableOpacity
                                    onPress={() => onBrandPressed(brand)}
                                    style={[styles.brand, isInBrands(brand) && styles.selectedBrand]}
                                    activeOpacity={1}
                                >
                                    <Text style={isInBrands(brand) ? styles.textDark : styles[`text${theme}`]}>
                                        {brand}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
                <Text style={[styles.title, styles[`text${theme}`]]}>Ages</Text>
                <View style={styles.slideValues}>
                    <Text style={styles[`text${theme}`]}>{ages[0]}</Text>
                    <Text style={styles[`text${theme}`]}>{ages[1]}</Text>
                </View>
                <Slider
                    value={ages}
                    onValueChange={(value) => setAges(value)}
                    minimumValue={1}
                    maximumValue={18}
                    step={1}
                    trackMarks={[5, 10, 15]}
                    renderTrackMarkComponent={() => <View style={styles.mark} />}
                    onSlidingComplete={() => onSlidingComplete('ages')}
                    thumbTintColor="#5F7ADB"
                    maximumTrackTintColor="#d3d3d3"
                    minimumTrackTintColor={lightMode.primary}
                    trackClickable
                    animateTransitions
                />
                <Text style={[styles.title, styles[`text${theme}`]]}>Price</Text>
                <View style={styles.slideValues}>
                    <Text style={styles[`text${theme}`]}>{prices[0]}</Text>
                    <Text style={styles[`text${theme}`]}>{prices[1]}</Text>
                </View>
                <Slider
                    value={prices}
                    onValueChange={(value) => setPrices(value)}
                    minimumValue={179}
                    maximumValue={1699}
                    step={1}
                    onSlidingComplete={() => onSlidingComplete('prices')}
                    thumbTintColor="#5F7ADB"
                    maximumTrackTintColor="#d3d3d3"
                    minimumTrackTintColor={lightMode.primary}
                    trackClickable
                    animateTransitions
                />
                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={onClearFilters}
                        style={[styles.button, styles.unfill]}
                        activeOpacity={1}
                    >
                        <Text style={styles[`text${theme}`]}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApplyFilters}
                        style={[styles.button, styles.fill]}
                        activeOpacity={1}
                        disabled={filters === 0}
                    >
                        <Text style={styles.textDark}>Apply {filters} Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    )
}

export default FilterPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalBackgroundLight: {
        backgroundColor: lightMode.background
    },
    modalBackgroundDark: {
        backgroundColor: darkMode.background
    },
    textLight: {
        color: lightMode.text
    },
    textDark: {
        color: darkMode.text
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 10,
        letterSpacing: 1
    },
    brands: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    brand: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: lightMode.primary,
        paddingHorizontal: 15,
        paddingVertical: 7,
        marginBottom: 10,
        marginRight: 10
    },
    selectedBrand: {
        backgroundColor: lightMode.primary
    },
    slideValues: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mark: {
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: lightMode.primary
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    },
    button: {
        width: '48%',
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    fill: {
        backgroundColor: lightMode.primary
    },
    unfill: {
        borderWidth: 2,
        borderColor: lightMode.primary
    }
});