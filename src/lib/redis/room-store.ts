import {Redis} from '@upstash/redis';
import {getRoom,getRoomByPin,hydrateRoom,serializeRoom,type Room,type StoredRoom} from '@/lib/game/room-engine';

const ttl=60*60*6;
const redis=process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN?new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN}):null;
const key=(id:string)=>`summit:room:${id}`;
const pinKey=(pin:string)=>`summit:pin:${pin}`;

export function redisConfigured(){return Boolean(redis)}
export async function saveRoom(room:Room){if(!redis)return;const raw=serializeRoom(room);await redis.pipeline().set(key(room.id),raw,{ex:ttl}).set(pinKey(room.pin),room.id,{ex:ttl}).exec()}
export async function loadRoom(id:string){const cached=getRoom(id);if(cached)return cached;if(!redis)return undefined;const raw=await redis.get<StoredRoom>(key(id));return raw?hydrateRoom(raw):undefined}
export async function loadRoomByPin(pin:string){const cached=getRoomByPin(pin);if(cached)return cached;if(!redis)return undefined;const id=await redis.get<string>(pinKey(pin));return id?loadRoom(id):undefined}
