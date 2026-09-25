import {NextResponse} from 'next/server';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

export async function GET(request:Request){
  const url=new URL(request.url);
  const code=url.searchParams.get('code');
  const next=url.searchParams.get('next')??'/dashboard';
  const cookieStore=await cookies();
  const response=NextResponse.redirect(new URL(next,url.origin));
  if(!code)return NextResponse.redirect(new URL('/login?error=missing_code',url.origin));
  const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>cookieStore.getAll(),setAll:items=>items.forEach(({name,value,options})=>response.cookies.set(name,value,options))}});
  const {error}=await supabase.auth.exchangeCodeForSession(code);
  if(error)return NextResponse.redirect(new URL('/login?error=auth_failed',url.origin));
  return response;
}
