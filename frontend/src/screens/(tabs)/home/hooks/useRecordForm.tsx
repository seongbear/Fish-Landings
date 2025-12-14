
import * as Location from 'expo-location';
import { useState } from 'react';
import { useFishSpecies } from './useFishSpecies';
import { Alert, Keyboard } from 'react-native';
import { useGearType } from './useGearType';

export const useRecordForm = () => {
    const [weight, setWeight] = useState('');
    const [species, setSpecies] = useState('');
    const [locationName, setLocationName] = useState('');
    const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
    const [gear, setGear] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const { fishSpeciesList } = useFishSpecies();
    const { gearTypeList: gearList } = useGearType();

    // Status State
    const [statusVisible, setStatusVisible] = useState(false);
    const [statusType, setStatusType] = useState<'success' | 'error'>('success');

    // Dropdown State for Species
    const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
    const [filteredSpecies, setFilteredSpecies] = useState(fishSpeciesList);

    // Dropdown State for Gear Types
    const [showGearDropdown, setShowGearDropdown] = useState(false);
    const [filteredGear, setFilteredGear] = useState(gearList);

    // Handlers
    const handleSpeciesChange = (text: string) => {
        setSpecies(text); // Always update the input text
        if (text) {
            const filtered = fishSpeciesList.filter(item => 
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredSpecies(filtered);
            setShowSpeciesDropdown(filtered.length > 0); 
        } else {
            setFilteredSpecies(fishSpeciesList);
            setShowSpeciesDropdown(false);
        }
    };

    const selectSpecies = (item: string) => {
        setSpecies(item);
        setShowSpeciesDropdown(false);
        Keyboard.dismiss();
    };

    const handleGearChange = (text: string) => {
        setGear(text); // Always update the input text
        if (text) {
            const filtered = gearList.filter(item => 
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredGear(filtered);
            setShowGearDropdown(filtered.length > 0); 
        } else {
            setFilteredGear(gearList);
            setShowGearDropdown(false);
        }
    };

    const selectGear = (item: string) => {
        setGear(item);
        setShowGearDropdown(false);
        Keyboard.dismiss();
    };

    const handleGetCurrentLocation = async () => {
        setIsLocating(true);
            try {
                // A. Request Permissions
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission denied', 'Allow location access to save GPS coordinates.');
                    setIsLocating(false);
                    return;
                }
    
                // B. Get Lat/Long
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
    
                const { latitude, longitude } = location.coords;
                setCoords({ lat: latitude, lng: longitude });
    
                // C. Reverse Geocode (Turn Lat/Long into a Name like "Semenyih")
                let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
                
                if (addressResponse.length > 0) {
                    const addr = addressResponse[0];
                    // Construct a readable string
                    const readableName = [addr.name, addr.city, addr.region]
                        .filter(part => part) // Remove nulls
                        .join(', ');
                    
                    setLocationName(readableName);
                } else {
                    setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }
    
            } catch (error) {
                Alert.alert('Error', 'Could not fetch location.');
                console.error(error);
            } finally {
                setIsLocating(false);
            }
    };
    
    return {
        weight,
        setWeight,
        locationName,
        setLocationName,
        coords,
        setCoords,
        isLocating,
        setIsLocating,
        // Species Dropdown
        species,
        setSpecies,
        showSpeciesDropdown,
        setShowSpeciesDropdown,
        handleSpeciesChange,
        filteredSpecies,
        setFilteredSpecies,
        selectSpecies,
        // Gear Type Dropdown
        gear,
        setGear,
        showGearDropdown,
        setShowGearDropdown,
        filteredGear,
        setFilteredGear,
        selectGear,
        handleGearChange,
        // handle Get Location
        handleGetCurrentLocation,
        // Status
        statusVisible,
        setStatusVisible,
        statusType,
        setStatusType,
    };
};