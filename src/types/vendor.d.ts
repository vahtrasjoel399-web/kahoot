declare module 'pdf-parse' { const parse:(buffer:Buffer)=>Promise<{text:string}>; export default parse }
declare module 'mammoth' { export function extractRawText(input:{buffer:Buffer}):Promise<{value:string}> }
