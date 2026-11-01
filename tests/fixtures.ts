import {defaultState,type LegacyStoredState} from '../src/model/appearance.ts';
export function legacyFixture():LegacyStoredState {
 const palette={sidebar:'#f0f2f1',workspace:'#f2f2ed',tools:'#abcdef',composer:'#fedcba',code:'#123456',overlay:'#654321',accent:'#3366ff'};
 const current={...structuredClone(defaultState.current),uiFont:'Old UI Font',codeFont:'Old Code Font',palettes:{light:palette,dark:{...palette,workspace:'#202020'}}};
 return {version:1,current,selectedPreset:'custom-kept',presets:[{id:'custom-kept',name:'保留的方案',value:{...structuredClone(current),mode:'dark'}}]};
}
