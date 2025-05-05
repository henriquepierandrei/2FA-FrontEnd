export interface LogEntry {
    keyId: string;
    emailSentTo: string;
    emailSentFrom: string;
    emailNumber: number;
    sentAt: string;
}

export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    sort: SortInfo;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface SortInfo {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface LogsResponse {
    logsDtoPageable: {
        content: LogEntry[];
        totalPages: number;
        last: boolean;
        totalElements: number;
        size: number;
        number: number;
        numberOfElements: number;
    };
}