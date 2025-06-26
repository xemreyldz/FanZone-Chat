export interface DecodedToken {
    username: string;
    profileImage?: string;
}

export function getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload;
    } catch (error) {
        console.error("Token çözümleme hatası:", error);
        return null;
    }
}
