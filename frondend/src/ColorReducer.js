export const initialState={
   feed:true,
   chat:false,
   video:false,
   group:false,
   cours:false,
   question:false,
   event:false,
}
export const reducer=(colorState,action)=>{
    switch(action.type){
        case 'feed':
            return {...colorState,feed:true,chat:false,video:false,group:false,cours:false,question:false,event:false};
        case 'chat':
            return {...colorState,feed:false,chat:true,video:false,group:false,cours:false,question:false,event:false};
            case 'video':
            return {...colorState,feed:false,chat:false,video:true,group:false,cours:false,question:false,event:false};
            case 'group':
            return {...colorState,feed:false,chat:false,video:false,group:true,cours:false,question:false,event:false};
            case 'cours':
            return {...colorState,feed:false,chat:false,video:false,group:false,cours:true,question:false,event:false};
            case 'question':
            return {...colorState,feed:false,chat:false,video:false,group:false,cours:false,question:true,event:false};
            case 'event':
            return {...colorState,feed:false,chat:false,video:false,group:false,cours:false,question:false,event:true};
        default:
            return colorState;
    }
}