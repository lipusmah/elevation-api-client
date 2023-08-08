
import Dexie, { liveQuery } from 'dexie';
import type { ElevationDetails, ElevationProfile } from './lib/api/ElevationApi';

class Db extends Dexie {
    profiles: Dexie.Table<IProfile, number>
    elevations: Dexie.Table<IElevation, number>;
    tags: Dexie.Table<ITag, number>;
    tagRelations: Dexie.Table<IElevationProfileTags, number>;

    constructor(dbName: string) {
        super(dbName);
        //
        this.version(1).stores({
            profiles: 'id++, dateCreated, title',
            elevations: 'id++, dateCreated, title',
            tags: 'id++, string',
            tagRelations: 'id++, tagId, elevationId, profileId, [tagId+profileId], [tagId+elevationId]',

        });

        this.open().then(function (db) {
            console.log(db);
        }).catch(function (err) {
            console.log(err);
        });
    }
}

class DbApi {
    db: Db;
    constructor(db: Db) {
        this.db = db;
    }

    getElevationsQuery() {
        return liveQuery(
            () => this.db.elevations.orderBy('dateCreated').reverse().toArray());
    }

    async getElevations() {
        const elevations = await this.db.elevations.orderBy('dateCreated').reverse().toArray();
        for (let e in elevations) {
            elevations[e].tags = await this.getTagsForItem('elevationId', elevations[e].id);
        }
        return elevations
    }

    getProfilesQuery() {
        return liveQuery(
            () => this.db.profiles.orderBy('dateCreated').toArray());
    }

    async getProfiles() {
        const profiles = await this.db.profiles.orderBy('dateCreated').reverse().toArray();
        for (let p in profiles) {
            profiles[p].tags = await this.getTagsForItem('profileId', profiles[p].id);
        }

        return profiles;
    }

    async getAvailableTags(ignoreTagIds: number[]) {
        const tags = await this.db.tags.toArray();
        const filtered = tags.filter(t => !ignoreTagIds.includes(t.id));
        return filtered;
    }

    async getProfile(id) {
        let profile = await this.db.profiles.where('id').equals(id).first();
        profile.tags = await this.getTagsForItem('profileId', profile.id);
        return profile;
    }

    async getTagsForItem(item: 'elevationId' | 'profileId', itemId) {
        const tagIds = await this.db.tagRelations.where(item).equals(itemId).toArray();
        const promises = tagIds.map(tagId => this.db.tags.where('id').equals(tagId.tagId).first());
        const tags = await Promise.all(promises);
        return tags
    }

    async getElevation(id) {
        let elevation = await this.db.elevations.get(id);
        elevation.tags = await this.getTagsForItem('elevationId', elevation.id);
        return elevation
    }
    async deleteElevation(id) {
        await this.db.elevations.where("id").equals(id).delete();
    }
    async deleteProfile(id) {
        await this.db.profiles.where("id").equals(id).delete();
    }
    async deleteTag(tagId, elevationId = null, profileId = null) {
        const itemKey = elevationId ? 'elevationId' : 'profileId';
        const itemId = elevationId ? elevationId : profileId;
        const relations = await this.db.tagRelations.where(`[tagId+${itemKey}]`).equals([tagId, itemId]).toArray();
        const allRelations = await this.db.tagRelations.where(`tagId`).equals(tagId).toArray();
        if (allRelations.length == 1) {
            await this.db.tags.where("id").equals(tagId).delete();
        }
        relations.forEach(async (rel) => { this.db.tagRelations.delete(rel.id) });
        if (elevationId) {
            return await this.getElevation(elevationId);
        }
        return await this.getProfile(profileId);
    }
    async createElevation(elevationDetails, title) {
        const el: IElevation = {
            elevation: elevationDetails,
            dateCreated: Date.now(),
            title: title,
        }
        const id = await this.db.elevations.add(el);
        return await this.getElevation(id);
    }

    async createTagRelation(tagId, elevationId, profileId) {
        let r: IElevationProfileTags;
        if (profileId) {
            r = {
                tagId: tagId,
                profileId: profileId
            }
            await this.db.tagRelations.add(r);
            return await this.getProfile(profileId);
        } else {
            r = {
                tagId: tagId,
                elevationId: elevationId
            }
            await this.db.tagRelations.add(r);
            return await this.getElevation(elevationId);
        }

    }


    async createTag(tag: ITag, elevationId = null, profileId = null) {
        const id = await this.db.tags.add(tag);
        if (elevationId) {
            const r: IElevationProfileTags = {
                tagId: id,
                elevationId: elevationId
            }
            await this.db.tagRelations.add(r);
            return await this.getElevation(elevationId);
        }
        else if (profileId) {
            const r: IElevationProfileTags = {
                tagId: id,
                profileId: profileId
            }
            await this.db.tagRelations.add(r);
            return await this.getProfile(profileId);
        }
    }

    async updateElevation(id, title, tagIds = []) {
        await this.db.elevations.update(id, { title: title });
    }

    async updateProfile(id, title) {
        await this.db.profiles.update(id, { title: title });
    }

    async createProfile(elevationProfile, title) {
        const pr: IProfile = {
            profile: elevationProfile,
            dateCreated: Date.now(),
            title: title,
        }
        const id = await this.db.profiles.add(pr);
        return await this.getProfile(id);
    }
}

const db = new Db('elevation_api_01');

export const db_api = new DbApi(db);


export interface IElevation {
    id?: number;
    dateCreated: number;
    title?: string;
    tags?: ITag[];
    elevation: ElevationDetails;
}

export interface IProfile {
    id?: number;
    dateCreated: number;
    title?: string;
    profile: ElevationProfile;
    tags?: ITag[];
}

export interface IElevationProfileTags {
    id?: number;
    tagId: number;
    profileId?: number;
    elevationId?: number;
}

export interface ITag {
    id?: number;
    text: string;
    color: string;
}