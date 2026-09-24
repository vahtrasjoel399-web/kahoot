import {NextResponse} from 'next/server';import {createRoom} from '@/lib/game/room-engine';
export async function POST(){const room=createRoom();return NextResponse.json({sessionId:room.id,pin:room.pin,hostToken:room.hostToken,state:room.state})}
