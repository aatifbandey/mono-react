export default function createScriptTag({ src, type = '', nomodule = false, dev=false }) {
  
   
    if (src) {
      src = dev ? `http://localhost:3001/${src}` : `${src}`
      return `<script defer="defer" src="${src}" ${type ? `type="${type}"` : ''} ${
        nomodule ? 'nomodule' : ''
      } crossorigin="anonymous"></script>`;
    }
    return '';
  }
  