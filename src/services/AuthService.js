import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Kullanıcı kaydını simüle eder ve rastgele bir token oluşturup kaydeder.
 * @returns {Promise<string>} Kaydedilen token'ı döndürür.
 */
const registerAndSaveToken = async () => {
    try {
        const randomToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        await AsyncStorage.setItem('userToken', randomToken);
        console.log('Token başarıyla kaydedildi:', randomToken);
        return randomToken;
    } catch (error) {
        console.error('Token kaydetme sırasında hata oluştu:', error);
        throw new Error('Token kaydedilemedi.');
    }
};

/**
 * Kullanıcının token'ını AsyncStorage'den silerek çıkış işlemini gerçekleştirir.
 */
const logout = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
        console.log('Token başarıyla silindi. Kullanıcı çıkış yaptı.');
    } catch (error) {
        console.error('Token silme sırasında hata oluştu:', error);
        throw new Error('Çıkış yapılamadı.');
    }
};

export const AuthService = {
    registerAndSaveToken,
    logout, // Yeni fonksiyonumuzu export ediyoruz
};