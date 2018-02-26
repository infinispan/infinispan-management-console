import {ICacheContainer} from "../../services/container/ICacheContainer";
import {ICache} from "../../services/cache/ICache";
import {CacheService} from "../../services/cache/CacheService";
import {IStateService} from "angular-ui-router";
import {convertBytes} from "../../common/utils/Utils";

export class QueryCtrl {
    static $inject: string[] = ["$state", "cacheService", "container", "cache", "allCacheStats", "$http"];

    constructor(private $state: IStateService, private cacheService: CacheService, private container: ICacheContainer,
                private cache: ICache, private allCacheStats: any[], private $http: ng.IHttpService) {
    }

    currentCacheAvailability(): boolean {
        return this.container.available;
    }

    currentClusterAvailabilityAsString(): string {
        return this.container.available ? "AVAILABLE" : "N/A";
    }

    convertBytes(bytes: number): string {
        return convertBytes(bytes);
    }

    resetStats(): void {
        this.cacheService.resetStats(this.container, this.cache).finally(() => {
            this.refresh();
        });
    }

    loadQuery(): void {
        const query = document.querySelector('#query-editor').value;
        this.$http.post("https://jsonplaceholder.typicode.com/posts", {query: query})
            .then((data: any) => {
                document.querySelector('#query-json-result').value = JSON.stringify(data.data);
            }
        )
    }

    refresh(): void {
        this.$state.reload();
    }
}
