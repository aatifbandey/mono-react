export default function createScriptTag({ src, type = '', nomodule = false }) {
   
    if (src) {
      return `<script defer="defer" src="${src}" ${type ? `type="${type}"` : ''} ${
        nomodule ? 'nomodule' : ''
      } crossorigin="anonymous"></script>`;
    }
    return '';
  }
  