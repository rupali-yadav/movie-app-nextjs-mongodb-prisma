import { useState } from 'react';
import axios from 'axios';



const useAddProfile = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const addProfile = async (name: string, image: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/addProfile', { name, image });
            return response.data;
        } catch (err) {
            setError(err as any);
        } finally {
            setLoading(false);
        }
    };

    return {
        addProfile,
        isLoading,
        error
    };
};

export default useAddProfile;