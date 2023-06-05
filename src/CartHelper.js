import RNUserIdentity from "react-native-user-identity";
import RNSmsRetriever from 'react-native-sms-retriever';
export const FORMATDATE = (min = 0) => {
    let formatDateLocal = new Date();
    formatDateLocal.setTime(new Date().getTime() + min * 60 * 1000);
    return formatDateLocal;
};

export const getUserEmailPopUp = async () => {
    return await RNUserIdentity.getUserId();
};
export const getUserPhonePopUp = async () => {
    try {
        const phoneNumber = await RNSmsRetriever.requestPhoneNumber();
        return phoneNumber.split('+91')[1];
    } catch (error) {
        return ""
    }
};
export const calcCrow = ({ lat1, lon1, lat2, lon2 }) => {
    function toRad(Value) {
        return (Value * Math.PI) / 180;
    }
    var Radius = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);
    var calculate = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = Radius * calculate;
    return Math.round(distance);
}