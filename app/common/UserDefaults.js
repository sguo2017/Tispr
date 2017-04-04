/**
 * Created by ljunb on 16/6/9.
 */
import { AsyncStorage } from 'react-native';

let UserDefaults = {
    setObject: (key, value) => {
        const jsonValue = JSON.stringify(value);
        return AsyncStorage.setItem(key, jsonValue, (error) => {
            if (!error) console.log(key + ' setOrRemoveObject error: ' + error);
        });
    },

    cachedObject: (key) => {
        return AsyncStorage.getItem(key)
            .then((value) => {
                if (value) {                    
                    return JSON.parse(value);
                } else {
                    return null;
                }
            });
    },

    clearCachedObject: (key) => {
        return AsyncStorage.removeItem(key);
    },
}

export default UserDefaults;