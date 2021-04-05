// import { Injectable } from '@angular/core';

// interface Scripts {
//   name: string;
//   src: string;
// }

// // <script src="../../assets/js/jquery.min.js"></script>
// // <script src="../../assets/js/bootstrap.min.js"></script>
// // <script src="../../assets/js/retina.js"></script>
// // <script src="../../assets/js/jquery.fitvids.js"></script>
// // <script src="../../assets/js/wow.js"></script>
// // <script src="../../assets/js/jquery.prettyPhoto.js"></script>

// // // <!-- CUSTOM PLUGINS -->
// // <script src="../../assets/js/custom.js"></script>
// // <script src="../../assets/js/main.js"></script>

// // <script src="../../assets/js/syntax-highlighter/scripts/shCore.js"></script>
// // <script src="../../assets/js/syntax-highlighter/scripts/shBrushXml.js"></script>
// // <script src="../../assets/js/syntax-highlighter/scripts/shBrushXml.js"></script>
// // <script src="../../assets/js/syntax-highlighter/scripts/shBrushJScript.js"></script>

// // export const ScriptStore: Scripts[] = [
// //   { name: 'wowjs', src: '../../../assets/js/wow.js' },
// //   { name: 'jqueryminjs', src: '../../../assets/js/jquery.min.js' },
// //   { name: 'bootstrapjs', src: '../../../assets/js/bootstrap.min.js' },
// //   { name: 'retinajs', src: '../../../assets/js/retina.js' },
// //   { name: 'jqueryfitvidsjs', src: '../../../assets/js/jquery.fitvids.js' },
// //   { name: 'jqueryprettyPhotojs', src: '../../../assets/js/jquery.prettyPhoto.js' },
// //   { name: 'shCorejs', src: '../../../assets/js/syntax-highlighter/scripts/shCore.js' },
// //   { name: 'shBrushXmljs', src: '../../../assets/js/syntax-highlighter/scripts/shBrushXml.js' },
// //   { name: 'shBrushCssjs', src: '../../../assets/js/syntax-highlighter/scripts/shBrushCss.js' },
// //   { name: 'shBrushJScriptjs', src: '../../../assets/js/syntax-highlighter/scripts/shBrushJScript.js' },
// //   { name: 'mainjs', src: '../../../assets/js/main.js' },
// //   { name: 'customjs', src: '../../../assets/js/custom.js' },

// // ];

// declare var document: any;

// @Injectable()
// export class DynamicScriptLoaderService {

//   private scripts: any = {};

//   constructor() {
//     ScriptStore.forEach((script: any) => {
//       this.scripts[script.name] = {
//         loaded: false,
//         src: script.src
//       };
//     });
//   }

//   loadAll(){
//     const promises: any[] = [];

//     var scripts = ScriptStore.map(i=>{
//       return i.name;
//     })

//     scripts.forEach((script) => promises.push(this.loadScript(script)));
//     return Promise.all(promises);
//   }

//   load(...scripts: string[]) {
//     const promises: any[] = [];
//     scripts.forEach((script) => promises.push(this.loadScript(script)));
//     return Promise.all(promises);
//   }

//   loadScript(name: string) {
//     return new Promise((resolve, reject) => {
//       if (!this.scripts[name].loaded) {
//         //load script
//         let script = document.createElement('script');
//         script.type = 'text/javascript';
//         script.src = this.scripts[name].src;
//         if (script.readyState) {  //IE
//             script.onreadystatechange = () => {
//                 if (script.readyState === "loaded" || script.readyState === "complete") {
//                     script.onreadystatechange = null;
//                     this.scripts[name].loaded = true;
//                     resolve({script: name, loaded: true, status: 'Loaded'});
//                 }
//             };
//         } else {  //Others
//             script.onload = () => {
//                 this.scripts[name].loaded = true;
//                 resolve({script: name, loaded: true, status: 'Loaded'});
//             };
//         }
//         script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
//         document.getElementsByTagName('head')[0].appendChild(script);
//       } else {
//         resolve({ script: name, loaded: true, status: 'Already Loaded' });
//       }
//     });
//   }

// }