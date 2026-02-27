import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface Destination {
    id: bigint;
    tagline: string;
    name: string;
    description: string;
    category: Category;
}
export type Time = bigint;
export enum Category {
    SacredSite = "SacredSite",
    NatureAdventure = "NatureAdventure",
    HeritageArchitecture = "HeritageArchitecture",
    AncientShrine = "AncientShrine"
}
export interface backendInterface {
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllDestinations(): Promise<Array<Destination>>;
    getAllSubscribers(): Promise<Array<string>>;
    getDestinationById(id: bigint): Promise<Destination>;
    initialize(): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<void>;
    subscribeNewsletter(email: string): Promise<void>;
}
