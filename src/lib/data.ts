import { writable, type Writable } from 'svelte/store';
import { base } from '$app/paths';
import type { RecordModel } from 'pocketbase';

// Import JSON data directly
import teamData from '../../data/team.json';
import musicianData from '../../data/musician.json';
import artistData from '../../data/artist.json';
import partnerData from '../../data/partner.json';
import metaverseData from '../../data/Metaverse.json';

interface TeamMember extends RecordModel {
	name: string;
	nickname: string;
	bio: string;
	role: string;
	pic: string[];
}

interface Musician extends RecordModel {
	name: string;
	genre: string;
	pic: string[];
}

interface Artist extends RecordModel {
	name: string;
	pic: string[];
}

interface Partner extends RecordModel {
	name: string;
	pic: string[];
}

// Base URL for static assets - now served from static/storage
const STORAGE_BASE_URL = '/storage';

// Collection ID mappings from storage-mapping.json
const COLLECTION_IDS = {
	'metaverse': '0ct1vfvg71ebu9r',
	'artist': '3jnleendml5ld46',
	'musician': '5rod2tewrl0ov3d',
	'partner': 'cx8afblkixaub05',
	'team': 'pbc_3824009647'
};

// Helper function to convert PocketBase pic references to static URLs
function mapPicUrls(item: any, collectionName: string): string[] {
	if (!item.pic) return [];
	
	// Parse the pic field if it's a JSON string
	let picArray: string[];
	if (typeof item.pic === 'string') {
		try {
			picArray = JSON.parse(item.pic);
		} catch {
			picArray = [item.pic];
		}
	} else if (Array.isArray(item.pic)) {
		picArray = item.pic;
	} else {
		return [];
	}
	
	// Get the collection ID from the mapping
	const collectionId = COLLECTION_IDS[collectionName as keyof typeof COLLECTION_IDS] || collectionName;
	
	// Map filenames to full URLs based on the storage structure
	return picArray.map(filename => {
		return `${base}${STORAGE_BASE_URL}/${collectionId}/${item.id}/${filename}`;
	});
}

// Process the data and create reactive stores
const processedTeamData = teamData.map(item => ({
	...item,
	pic: mapPicUrls(item, 'team')
}));

const processedMusicianData = musicianData.map(item => ({
	...item,
	pic: mapPicUrls(item, 'musician')
}));

const processedArtistData = artistData.map(item => ({
	...item,
	pic: mapPicUrls(item, 'artist')
}));

const processedPartnerData = partnerData.map(item => ({
	...item,
	pic: mapPicUrls(item, 'partner')
}));

const processedMetaverseData = metaverseData.map(item => ({
	...item,
	pic: item.pic ? [`${base}${STORAGE_BASE_URL}/${COLLECTION_IDS.metaverse}/${item.id}/${item.pic}`] : []
}));

// Create stores
const team: Writable<TeamMember[]> = writable(processedTeamData);
const musicians: Writable<Musician[]> = writable(processedMusicianData);
const artists: Writable<Artist[]> = writable(processedArtistData);
const partner: Writable<Partner[]> = writable(processedPartnerData);
const metaverse: Writable<RecordModel[]> = writable(processedMetaverseData);

// Helper function for direct navigation data fetching
async function fetchCollection<T extends RecordModel>(
	collection: string,
	customFetch?: typeof fetch
): Promise<T[]> {
	// Since we're using static data, we can ignore the customFetch parameter
	switch (collection) {
		case 'team':
			return processedTeamData as T[];
		case 'musician':
			return processedMusicianData as T[];
		case 'artist':
			return processedArtistData as T[];
		case 'partner':
			return processedPartnerData as T[];
		case 'metaverse':
			return processedMetaverseData as T[];
		default:
			return [];
	}
}

// Maintain the same API as the original db.ts
let teamDone = false;
const getTeam = async (customFetch?: typeof fetch) => {
	if (!teamDone) {
		teamDone = true;
		// Data is already loaded, just return the store
	}
	return team;
};

let musiciansDone = false;
const getMusicians = () => {
	if (!musiciansDone) {
		musiciansDone = true;
		// Data is already loaded, just return the store
	}
	return musicians;
};

let artistsDone = false;
const getArtists = () => {
	if (!artistsDone) {
		artistsDone = true;
		// Data is already loaded, just return the store
	}
	return artists;
};

let partnerDone = false;
const getPartner = () => {
	if (!partnerDone) {
		partnerDone = true;
		// Data is already loaded, just return the store
	}
	return partner;
};

let metaverseDone = false;
const getMetaverse = () => {
	if (!metaverseDone) {
		metaverseDone = true;
		// Data is already loaded, just return the store
	}
	return metaverse;
};

// Initialize data (no-op since data is already loaded)
// getPartner();
// getMetaverse();

export default { getTeam, getArtists, getMusicians, partner, metaverse };