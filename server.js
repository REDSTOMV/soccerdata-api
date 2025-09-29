// server.js
const express = require('express');
const cors = require('cors');
app.use(cors());
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = 'https://api.soccerdataapi.com';
const AUTH_TOKEN = process.env.AUTH_TOKEN || '4f2389544e70f17cded0479860b38d82fd198a20';

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to make API requests
async function fetchFromAPI(endpoint, queryParams = {}) {
    const params = new URLSearchParams({
        ...queryParams,
        auth_token: AUTH_TOKEN
    });
    
    const url = `${API_BASE_URL}/${endpoint}/?${params}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip"
            },
        });
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error.message);
        throw error;
    }
}

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Soccerdata API Server',
        version: '1.0.0',
        endpoints: [
            '/api/countries',
            '/api/leagues',
            '/api/seasons',
            '/api/stages',
            '/api/groups',
            '/api/stadiums',
            '/api/teams',
            '/api/players',
            '/api/transfers',
            '/api/head-to-head',
            '/api/standings',
            '/api/livescores',
            '/api/matches',
            '/api/match/:match_id',
            '/api/match-preview/:match_id',
            '/api/match-previews-upcoming'
        ]
    });
});

// Get Countries
app.get('/api/countries', async (req, res) => {
    try {
        const data = await fetchFromAPI('country');
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Leagues
app.get('/api/leagues', async (req, res) => {
    try {
        const { country_id } = req.query;
        const params = {};
        if (country_id) params.country_id = country_id;
        
        const data = await fetchFromAPI('league', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Seasons
app.get('/api/seasons', async (req, res) => {
    try {
        const { league_id } = req.query;
        const params = {};
        if (league_id) params.league_id = league_id;
        
        const data = await fetchFromAPI('season', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Season Stages
app.get('/api/stages', async (req, res) => {
    try {
        const { league_id, season } = req.query;
        const params = {};
        if (league_id) params.league_id = league_id;
        if (season) params.season = season;
        
        const data = await fetchFromAPI('stage', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Groups
app.get('/api/groups', async (req, res) => {
    try {
        const { stage_id } = req.query;
        const params = {};
        if (stage_id) params.stage_id = stage_id;
        
        const data = await fetchFromAPI('group', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Stadiums
app.get('/api/stadiums', async (req, res) => {
    try {
        const { team_id } = req.query;
        const params = {};
        if (team_id) params.team_id = team_id;
        
        const data = await fetchFromAPI('stadium', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Teams
app.get('/api/teams', async (req, res) => {
    try {
        const { team_id, league_id, country_id } = req.query;
        const params = {};
        if (team_id) params.team_id = team_id;
        if (league_id) params.league_id = league_id;
        if (country_id) params.country_id = country_id;
        
        const data = await fetchFromAPI('team', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Players
app.get('/api/players', async (req, res) => {
    try {
        const { player_id, team_id } = req.query;
        const params = {};
        if (player_id) params.player_id = player_id;
        if (team_id) params.team_id = team_id;
        
        const data = await fetchFromAPI('player', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Transfers
app.get('/api/transfers', async (req, res) => {
    try {
        const { team_id, player_id } = req.query;
        const params = {};
        if (team_id) params.team_id = team_id;
        if (player_id) params.player_id = player_id;
        
        const data = await fetchFromAPI('transfers', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Head to Head
app.get('/api/head-to-head', async (req, res) => {
    try {
        const { team_1_id, team_2_id } = req.query;
        
        if (!team_1_id || !team_2_id) {
            return res.status(400).json({
                success: false,
                error: 'Both team_1_id and team_2_id are required'
            });
        }
        
        const params = {
            team_1_id,
            team_2_id
        };
        
        const data = await fetchFromAPI('head-to-head', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Standings
app.get('/api/standings', async (req, res) => {
    try {
        const { league_id, season, stage_id } = req.query;
        const params = {};
        if (league_id) params.league_id = league_id;
        if (season) params.season = season;
        if (stage_id) params.stage_id = stage_id;
        
        const data = await fetchFromAPI('standing', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Live Scores
app.get('/api/livescores', async (req, res) => {
    try {
        const { league_id, country_id } = req.query;
        const params = {};
        if (league_id) params.league_id = league_id;
        if (country_id) params.country_id = country_id;
        
        const data = await fetchFromAPI('livescores', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Matches
app.get('/api/matches', async (req, res) => {
    try {
        const { league_id, team_id, season, date_from, date_to } = req.query;
        const params = {};
        if (league_id) params.league_id = league_id;
        if (team_id) params.team_id = team_id;
        if (season) params.season = season;
        if (date_from) params.date_from = date_from;
        if (date_to) params.date_to = date_to;
        
        const data = await fetchFromAPI('matches', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Single Match
app.get('/api/match/:match_id', async (req, res) => {
    try {
        const { match_id } = req.params;
        
        if (!match_id) {
            return res.status(400).json({
                success: false,
                error: 'match_id is required'
            });
        }
        
        const data = await fetchFromAPI('match', { match_id });
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Match Preview
app.get('/api/match-preview/:match_id', async (req, res) => {
    try {
        const { match_id } = req.params;
        
        if (!match_id) {
            return res.status(400).json({
                success: false,
                error: 'match_id is required'
            });
        }
        
        const data = await fetchFromAPI('match-preview', { match_id });
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Upcoming Match Previews
app.get('/api/match-previews-upcoming', async (req, res) => {
    try {
        const { league_id, date } = req.query;
        const params = {};
        if (league_id) params.league_id = league_id;
        if (date) params.date = date;
        
        const data = await fetchFromAPI('match-previews-upcoming', params);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Soccerdata API Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Token: ${AUTH_TOKEN.substring(0, 10)}...`);
});

module.exports = app;