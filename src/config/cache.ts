import redis from "ioredis"; 

export class ServerAPICache {
    private static instance: ServerAPICache | null = null;

    private client: redis | null;
    public enabled: boolean = false;

    static enabled = false;
    // 5 mins, 5 * 60
    static DEFAULT_CACHE_EXPIRY_SECONDS = 300 as const;
    static CACHE_EXPIRY_HEADER_NAME = "Server-Cache-Expiry" as const;

    constructor() {
        const redisConnURL = process.env.SERVER_API_REDIS_CONN_URL;
        this.enabled = ServerAPICache.enabled = Boolean(redisConnURL);
        this.client = this.enabled ? new redis(String(redisConnURL)) : null;
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
        let data = JSON.parse(String(cachedData)) as T;

        if (!data) {
            data = await dataGetter();
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
