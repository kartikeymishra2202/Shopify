export function StimulateDelay(time:number){
    return new Promise((resolve)=>setTimeout(resolve,time));

}