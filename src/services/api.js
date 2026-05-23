const API_BASE_URL = import.meta.env.VITE_SPORTSRC_API_URL || 'https://api.sportsrc.org/';
const REQUIRED_CATEGORIES = ['football'];

const requestSportsRc = async (params) => {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    const url = new URL(base);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    });

    const response = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error(`SportsRC request failed with HTTP ${response.status}`);
    }

    return response.json();
};

const extractList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.matches)) return payload.matches;
    if (payload && Array.isArray(payload.results)) return payload.results;
    return [];
};

const extractDetailObject = (payload) => {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload[0] || null;
    if (payload.data && !Array.isArray(payload.data) && typeof payload.data === 'object') return payload.data;
    if (payload.match && typeof payload.match === 'object') return payload.match;
    if (payload.result && typeof payload.result === 'object') return payload.result;
    if (typeof payload === 'object') return payload;
    return null;
};

const asIsoString = (value) => {
    if (!value) return null;

    if (typeof value === 'number') {
        const millis = value < 10_000_000_000 ? value * 1000 : value;
        return new Date(millis).toISOString();
    }

    if (typeof value === 'string' && /^\d+$/.test(value)) {
        const numeric = Number(value);
        const millis = numeric < 10_000_000_000 ? numeric * 1000 : numeric;
        return new Date(millis).toISOString();
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
};

const inferStatusFromStartTime = (startTimeIso) => {
    if (!startTimeIso) return 'upcoming';

    const startMillis = new Date(startTimeIso).getTime();
    if (Number.isNaN(startMillis)) return 'upcoming';

    const elapsed = Date.now() - startMillis;

    if (elapsed < 0) return 'upcoming';
    // When status is missing, consider the event live for a reasonable window.
    if (elapsed <= 3 * 60 * 60 * 1000) return 'live';
    return 'finished';
};

const normalizeStatus = (rawStatus, startTimeIso) => {
    const status = String(rawStatus || '').toLowerCase();

    if (status.includes('live') || status.includes('playing') || status === 'in_progress') {
        return 'live';
    }

    if (status.includes('upcoming') || status.includes('scheduled') || status === 'not_started') {
        return 'upcoming';
    }

    if (status.includes('finish') || status.includes('ended') || status.includes('complete')) {
        return 'finished';
    }

    if (status) return status;
    return inferStatusFromStartTime(startTimeIso);
};

const resolveCategory = (match, categoryHint) => {
    const fromMatch = match?.category || match?.sport || match?.type;
    return String(fromMatch || categoryHint || '').toLowerCase();
};

const resolveStreamUrl = (match) => {
    if (!match || typeof match !== 'object') return '';

    const direct = [
        match.stream_url,
        match.stream,
        match.embed,
        match.embed_url,
        match.iframe,
        match.player,
        match.url,
        match.watch_url,
        match.live_url,
        match.streamUrl
    ].find((value) => typeof value === 'string' && value.trim());

    if (direct) return direct;

    const streamArray = [match.streams, match.sources, match.links].find(Array.isArray);
    if (streamArray) {
        const firstUsable = streamArray.find((item) => item && typeof item === 'object' && typeof (item.url || item.src || item.link || item.embed || item.embedUrl || item.iframe) === 'string');
        if (firstUsable) {
            return firstUsable.url || firstUsable.src || firstUsable.link || firstUsable.embed || firstUsable.embedUrl || firstUsable.iframe || '';
        }

        const firstString = streamArray.find((item) => typeof item === 'string' && item.trim());
        if (firstString) return firstString;
    }

    if (match.stream && typeof match.stream === 'object') {
        return match.stream.url || match.stream.src || match.stream.link || match.stream.embedUrl || match.stream.embed || '';
    }

    return '';
};

const parseScorePair = (scoreValue) => {
    if (typeof scoreValue !== 'string') return null;

    const parsed = scoreValue.match(/(\d+)\s*[-:]\s*(\d+)/);
    if (!parsed) return null;

    return {
        home: Number(parsed[1]),
        away: Number(parsed[2])
    };
};

const resolveScore = (prefix, team, match) => {
    const direct = team?.score ?? match?.[`${prefix}_score`] ?? match?.scores?.[prefix] ?? match?.score?.[prefix] ?? null;
    if (direct !== null && direct !== undefined && direct !== '') return direct;

    const parsedPair = parseScorePair(match?.scoreline || match?.score || match?.result || '');
    if (parsedPair) {
        return prefix === 'home' ? parsedPair.home : parsedPair.away;
    }

    // Keep score numeric for live cards when API omits score fields.
    return 0;
};

const normalizeTeam = (prefix, match) => {
    const team = match?.[`${prefix}Team`] || match?.teams?.[prefix] || null;
    const resolvedName = team?.name || match?.[`${prefix}_team`] || match?.[`${prefix}_name`] || match?.[prefix] || '';

    return {
        name: resolvedName,
        shortName: team?.shortName || match?.[`${prefix}_short`] || (resolvedName ? String(resolvedName).slice(0, 3).toUpperCase() : ''),
        logo: team?.logo || team?.badge || match?.[`${prefix}_logo`] || match?.[`${prefix}_badge`] || '',
        score: resolveScore(prefix, team, match)
    };
};

const normalizeMatch = (match, categoryHint) => {
    if (!match || typeof match !== 'object') return null;

    const id = match.id || match.match_id || match._id || match.slug || null;
    const startTime = asIsoString(match.start_time || match.startTime || match.timestamp || match.date);
    const homeTeam = normalizeTeam('home', match);
    const awayTeam = normalizeTeam('away', match);
    const title = match.title || (homeTeam.name && awayTeam.name ? `${homeTeam.name} vs ${awayTeam.name}` : null);

    return {
        id,
        title,
        homeTeam,
        awayTeam,
        league: match.league || match.competition || match.tournament || '',
        category: resolveCategory(match, categoryHint),
        status: normalizeStatus(match.status || match.state || match.match_status, startTime),
        minute: match.minute || match.time || match.clock || '',
        startTime,
        thumbnail: match.thumbnail || match.poster || match.cover || match.banner || '',
        description: match.description || '',
        streamUrl: resolveStreamUrl(match),
        views: match.views || match.watching || '',
        spectators: match.spectators || match.attendance || '',
        referee: match.referee || '',
        stats: match.stats || match.statistics || match.live_stats || null,
        chatMessages: match.chatMessages || match.chat_messages || match.chat || null
    };
};

const getCategoryKey = (item) => {
    if (typeof item === 'string') return item.trim().toLowerCase();
    if (!item || typeof item !== 'object') return '';

    const value = item.slug || item.key || item.id || item.name || item.category || item.sport;
    return String(value || '').trim().toLowerCase();
};

const fetchCategories = async () => {
    const payload = await requestSportsRc({ data: 'sports' });
    const rawCategories = extractList(payload);

    const discovered = rawCategories.map(getCategoryKey).filter(Boolean);
    const unique = [...new Set([...discovered, ...REQUIRED_CATEGORIES])];
    if (unique.length === 0) {
        throw new Error('SportsRC returned no categories from data=sports');
    }

    return unique;
};

const fetchMatchesByCategory = async (category) => {
    const payload = await requestSportsRc({ data: 'matches', category });
    const rawMatches = extractList(payload);

    return rawMatches
        .map((match) => normalizeMatch(match, category))
        .filter((match) => match && match.id);
};

export const apiService = {
    async getAllMatches() {
        const categories = await fetchCategories();
        const grouped = await Promise.allSettled(categories.map((category) => fetchMatchesByCategory(category)));

        const successfulGroups = grouped
            .filter((result) => result.status === 'fulfilled')
            .map((result) => result.value);

        if (successfulGroups.length === 0) {
            throw new Error('SportsRC returned no successful category schedules');
        }

        return successfulGroups.flat();
    },

    async getLiveMatches() {
        const all = await this.getAllMatches();
        return all.filter((match) => match.status === 'live');
    },

    async getUpcomingMatches() {
        const all = await this.getAllMatches();
        return all.filter((match) => match.status === 'upcoming');
    },

    async getMatchById(id) {
        if (!id) {
            throw new Error('Match id is required');
        }

        const all = await this.getAllMatches();
        const existing = all.find((match) => String(match.id) === String(id));

        if (existing) {
            const detailPayload = await requestSportsRc({
                data: 'detail',
                category: existing.category,
                id: existing.id
            });
            const detailSource = extractDetailObject(detailPayload);
            const detail = normalizeMatch(detailSource, existing.category);
            if (detail && detail.id) {
                return {
                    ...existing,
                    ...detail,
                    homeTeam: {
                        ...existing.homeTeam,
                        ...detail.homeTeam
                    },
                    awayTeam: {
                        ...existing.awayTeam,
                        ...detail.awayTeam
                    }
                };
            }

            return existing;
        }
        throw new Error(`Match with ID "${id}" was not found in SportsRC schedules.`);
    },

    async getRelatedMatches(category, currentId) {
        const all = await this.getAllMatches();
        return all
            .filter((match) => match.category === category && String(match.id) !== String(currentId))
            .slice(0, 4);
    }
};