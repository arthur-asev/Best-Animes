// 1. Importa a função CONSTRUTORA (o valor) como default, renomeando-a para IORedisConstructor.
// 2. Importa o TIPO (Redis) como named export.
import IORedisConstructor, { Redis } from "ioredis"; 

export class ServerAPICache {
    private static instance: ServerAPICache | null = null;

    // AQUI: Usamos Redis como TIPO
    private client: Redis | null;
    public enabled: boolean = false;

    static enabled = false;
    // 5 mins, 5 * 60
    static DEFAULT_CACHE_EXPIRY_SECONDS = 300 as const;
    static CACHE_EXPIRY_HEADER_NAME = "Server-Cache-Expiry" as const;

    constructor() {
        const redisConnURL = process.env.SERVER_API_REDIS_CONN_URL;
        this.enabled = ServerAPICache.enabled = Boolean(redisConnURL);
        
        // AQUI: Usamos IORedisConstructor como VALOR para instanciar
        this.client = this.enabled ? new IORedisConstructor(String(redisConnURL)) : null;
    }

    static getInstance() {
        if (!ServerAPICache.instance) {
            ServerAPICache.instance = new ServerAPICache();
        }
        return ServerAPICache.instance;
    }

    /**
     * @param expirySeconds set to 300 (5 mins) by default
     */
    async getOrSet<T>(
        dataGetter: () => Promise<T>,
        key: string,
        expirySeconds: number = ServerAPICache.DEFAULT_CACHE_EXPIRY_SECONDS
    ) {
        const cachedData = this.enabled
            ? (await this.client?.get?.(key)) || null
            : null;
        
        let data: T;

        // Try to parse cached data
        if (cachedData) {
            try {
                // Ensure we handle the case where cachedData is a string "null" or invalid JSON
                data = JSON.parse(cachedData) as T;
                return data;
            } catch (e) {
                console.error("Failed to parse cached data for key:", key, e);
                // Fall through to re-fetch data if parsing fails
            }
        }
        
        // If data is not found or parsing failed, fetch new data
        data = await dataGetter();
        
        // Only set cache if enabled and data is valid (optional check)
        if (this.enabled) {
            await this.client?.set?.(
                key,
                JSON.stringify(data),
                "EX",
                expirySeconds
            );
        }

        return data;
    }

    closeConnection() {
        this.client
            ?.quit()
            ?.then(() => {
                this.client = null;
                ServerAPICache.instance = null;
                console.info(
                    "server-api redis connection closed and cache instance reset"
                );
            })
            .catch((err) => {
                console.error(
                    `server-api error while closing redis connection: ${err}`
                );
            });
    }
}

export const cache = ServerAPICache.getInstance();