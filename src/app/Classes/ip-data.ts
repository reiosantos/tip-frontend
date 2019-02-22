import DateTimeFormat = Intl.DateTimeFormat;

export class IpData {
    sourceIP: string;
    sourceNetwork: string;
    attempts: number;
    blockDate: Date;
    unblockDate: Date;
    taxonomy: any;
    type: string;
    confidenceLevel: any;
    eventDescription: string;
    feedAccuracy: any;
    overAllAttempts: any;
    sourceContact: string;
    sourceName: string;
    asn: any;
    fqdn: any;
    geolocation: any;
    registry: any;
    url: string;
    observationTime: DateTimeFormat;
}
