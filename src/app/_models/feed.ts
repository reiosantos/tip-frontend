export class Feed {
    id: string;
    feed_name: string;
    feed_provider: string;
    feed_url: string;
    time_source: string;
    time_observation: string;
    source_ip: string;
    source_network: string;
    attempts: number;
    block_date: string;
    unblock_date: string;
    classification_taxonomy: string;
    classification_type: string;
    confidence_level: number;
    event_description_text: string;
    feed_accuracy: string;
    overall_attempts: number;
    source_contact: string;
    source_as_name: string;
    source_asn: number;
    source_fqdn: string;
    source_geolocation_cc: string;
    registry: string;
    source_url: string;
    source_resource_dns: string;
}
