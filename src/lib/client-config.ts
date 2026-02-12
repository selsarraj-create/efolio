import redis from "@/lib/redis";
import { getModelConfig } from "@/lib/config";
import { ModelConfig } from "@/types";

export async function getClientConfig(clientSlug: string): Promise<any | null> {
    if (!redis) return null;

    // 1. Try to get custom full JSON config
    const customConfigStr = await redis.get(`client:${clientSlug}:custom_config`);

    // 2. Get Basic Client Data (Name/Password/Status) to ensure existence and auth
    const clientData = await redis.hgetall(`client:${clientSlug}`);
    if (!clientData || Object.keys(clientData).length === 0) return null;

    // 3. Get Base Template Config
    const baseConfig = await getModelConfig();

    let finalConfig = { ...baseConfig };

    if (customConfigStr) {
        try {
            const customConfig = JSON.parse(customConfigStr);
            // Spread override allows the saved config to replace defaults
            finalConfig = { ...baseConfig, ...customConfig };
        } catch (e) {
            console.error("Failed to parse custom config for", clientSlug);
        }
    } else {
        // Fallback: Just override name from the hash if no custom config exists yet
        finalConfig.personalInfo = {
            ...baseConfig.personalInfo,
            name: clientData.name,
        };
    }

    // Mandatory Overrides for Context
    finalConfig._siteId = clientSlug;
    finalConfig._storage = 'kv-client';

    // Ensure password matches the source of truth (the hash)
    if (clientData.password) {
        finalConfig.password = clientData.password;
    }

    return finalConfig;
}
