import { promises as fs } from 'fs';
import path from 'path';
import redis from '@/lib/redis';
import { ModelConfig } from '@/types';

const FALLBACK_CONFIG: ModelConfig = {
    "personalInfo": {
        "name": "Model Name",
        "email": "contact@example.com",
        "copyrightYear": 2026,
        "bio": "Professional model based in New York City, available for fashion, commercial, and runway work."
    },
    "stats": {
        "height": "178cm",
        "bust": "86cm",
        "waist": "61cm",
        "hips": "89cm",
        "shoes": "39",
        "eyes": "Blue",
        "hair": "Blonde"
    },
    "images": {
        "profile": "/uploads/profile.png",
        "hero": "/uploads/hero.png",
        "portfolio": [
            "/uploads/portfolio-1.png",
            "/uploads/portfolio-2.png",
            "/uploads/portfolio-3.png",
            "/uploads/portfolio-4.png",
            "/uploads/portfolio-5.png",
            "/uploads/portfolio-6.png"
        ]
    }
};

const configPath = path.join(process.cwd(), 'src', 'data', 'model-config.json');

export const SITE_ID = process.env.SITE_ID || 'site_a';
export const CONFIG_KEY = `${SITE_ID}:model-config`;

export async function getModelConfig(): Promise<ModelConfig & { _storage?: string; _siteId?: string }> {
    try {
        if (process.env.REDIS_URL && redis) {
            try {
                const rawData = await redis.get(CONFIG_KEY);
                if (rawData) {
                    const data = JSON.parse(rawData);
                    return { ...data, _storage: 'kv', _siteId: SITE_ID };
                }
            } catch (e) {
                console.error("Redis error:", e);
            }
        }

        // Fallback: Use FS in Dev for live editing
        if (process.env.NODE_ENV === 'development') {
            try {
                const fileContents = await fs.readFile(configPath, 'utf8');
                const data = JSON.parse(fileContents);
                return {
                    ...data,
                    _storage: 'fs',
                    _siteId: SITE_ID
                };
            } catch (e) {
                console.warn("Failed to read local file in dev.", e);
            }
        }

        // Final Fallback (Production with empty Redis, or FS failed)
        return {
            ...FALLBACK_CONFIG,
            _storage: process.env.REDIS_URL ? 'kv-migrating' : 'static-fallback',
            _siteId: SITE_ID
        };

    } catch (e) {
        console.error("Config Loading Error:", e);
        // Absolute last resort
        return { ...FALLBACK_CONFIG, _storage: 'error-fallback' };
    }
}
