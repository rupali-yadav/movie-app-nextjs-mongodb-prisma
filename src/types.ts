export interface iMovie {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    genre: string;
    duration: string;
    watchProgresses: Array<iWatchProgress>;
    isFavorite?: boolean;
}

export interface iWatchProgress {
    id: string;
    userId: string;
    movieId: string;
    progress: number;
    movie: iMovie; // Include the movie details
}
export interface movieState {
    movies: Array<iMovie> | null;
}

export interface iuserState {
    isSession: boolean;
}

export interface iUser {
    id: string;
    name: string;
    image: string;
    email: string;
    hashedPassword: string;
    createdAt: string;
    accounts: string;
    favoriteIds: string;
    profiles: iProfile[];
}

export interface iProfile {
    id: string;
    name: string;
    image?: string;
    userId: string;
}

export type ProfileContextType = {
    selectedProfile: iProfile;
    setSelectedProfile: (profile: iProfile) => void;
};

export interface iMovieWrapper {
    movie: iMovie
}