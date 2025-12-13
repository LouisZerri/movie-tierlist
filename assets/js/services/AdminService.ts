import Axios from 'axios';
import { API_URL, LOGIN, LOGOUT } from '../config';


// Pour se connecter
async function login(email: string, password: string): Promise<{ isAdmin: boolean }> {
    const res = await Axios.post(LOGIN, { email, password }, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return res.data;
}


// Pour se déconnecter
function logout() {
    return Axios.post(LOGOUT, {}, { withCredentials: true });
}


// Pour vérifier si on est bien admin
async function checkAuth(): Promise<{ isAdmin: boolean }> {
    const res = await Axios.get(`${API_URL}me`, { withCredentials: true });
    return res.data;
}



export default {
    login,
    logout,
    checkAuth
}