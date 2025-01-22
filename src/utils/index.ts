import axios from "axios";

export const updateProgress = async (progress: number, movieId: string | string[], profileId: string) => {
    try {
        const res = await axios.post('/api/updateWatchProgress', {
            movieId,
            progress,
            profileId
        });
    } catch (e) {
        console.log(e)
    }

}

export const convertTimeToSeconds = (time: number): number => {
    const [seconds] = time?.toString().split('.').map(parseFloat);
    return Math.floor(seconds);
}